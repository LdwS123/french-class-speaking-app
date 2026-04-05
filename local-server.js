const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const { handler: kokaHandler } = require("./netlify/functions/koka-chat.js");

const ROOT = __dirname;
const ENV_PATH = path.join(ROOT, ".env.local");
const PORT = Number(process.env.PORT || 4321);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function loadLocalEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    return;
  }

  const content = fs.readFileSync(ENV_PATH, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) {
      return;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function safeJoin(root, requestPath) {
  const normalized = path.normalize(path.join(root, requestPath));
  if (!normalized.startsWith(root)) {
    return null;
  }
  return normalized;
}

async function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function resolveStaticPath(urlPath) {
  if (urlPath === "/") {
    return path.join(ROOT, "index.html");
  }

  const cleanPath = decodeURIComponent(urlPath);
  const direct = safeJoin(ROOT, cleanPath);
  if (direct && fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }

  if (!path.extname(cleanPath)) {
    const htmlPath = safeJoin(ROOT, `${cleanPath}.html`);
    if (htmlPath && fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
      return htmlPath;
    }
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (requestUrl.pathname === "/api/koka-chat") {
    const body = await parseRequestBody(req).catch(() => "");
    const response = await kokaHandler({
      httpMethod: req.method,
      body,
      headers: req.headers
    });

    send(res, response.statusCode || 200, response.body || "", response.headers || {});
    return;
  }

  const filePath = resolveStaticPath(requestUrl.pathname);
  if (!filePath) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 500, "Server error", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    send(res, 200, content, { "Content-Type": mimeType });
  });
});

loadLocalEnv();

server.listen(PORT, () => {
  console.log(`French Class local server running on http://localhost:${PORT}`);
});
