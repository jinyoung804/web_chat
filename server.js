const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.resolve(__dirname);
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD")
    return send(res, 405, "Method Not Allowed");
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, `http://${req.headers.host}`).pathname,
    );
  } catch {
    return send(res, 400, "Bad Request");
  }

  const filePath = path.resolve(
    ROOT,
    `.${pathname === "/" ? "/index.html" : pathname}`,
  );
  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`))
    return send(res, 403, "Forbidden");

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) return send(res, 404, "Not Found");
    res.writeHead(200, {
      "Content-Type":
        MIME_TYPES[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream",
      "Content-Length": stats.size,
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}`);
  console.log(`Serving files from ${ROOT}`);
});

server.on("error", (error) => {
  console.error(`Unable to start server: ${error.message}`);
  process.exitCode = 1;
});

//--------Welcome WebSocketServer World ------------
const { WebSocketServer } = require("ws");

// http 서버: 정적 파일(html,css,js,...) 서비스
// WebSocket 서버 : 실시간 서비스
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("클라이언트 연결");

  //client 에서 send 한 것을 받는 위치
  ws.on("message", (data) => {
    console.log(data.toString());
  });
  ws.on("close", () => {
    console.log("클라이언트 연결 해제");
  });
});
