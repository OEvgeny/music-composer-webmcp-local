import http from "node:http";
import https from "node:https";
import { URL } from "node:url";

const target = process.argv[2];

if (!target) {
  console.error("Usage: npm run proxy -- <target-url>");
  console.error("Example: npm run proxy -- http://localhost:11434");
  process.exit(1);
}

let targetUrl;
try {
  targetUrl = new URL(target);
} catch {
  console.error(`Invalid URL: ${target}`);
  process.exit(1);
}

const PORT = 3033;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, anthropic-version, anthropic-dangerous-direct-browser-access",
};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, CORS_HEADERS);
    res.end();
    return;
  }

  const outHeaders = { ...req.headers, host: targetUrl.host };
  delete outHeaders["origin"];
  delete outHeaders["referer"];

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
    path: req.url,
    method: req.method,
    headers: outHeaders,
  };

  const protocol = targetUrl.protocol === "https:" ? https : http;

  const proxyReq = protocol.request(options, (proxyRes) => {
    const responseHeaders = { ...proxyRes.headers, ...CORS_HEADERS };
    res.writeHead(proxyRes.statusCode ?? 200, responseHeaders);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error(`[proxy] ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "application/json", ...CORS_HEADERS });
    }
    res.end(JSON.stringify({ error: `Proxy error: ${err.message}` }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log(`  Proxy  http://localhost:${PORT}  →  ${target}`);
  console.log("");
  console.log(`  Set the Local endpoint URL in the app to:`);
  console.log(`  http://localhost:${PORT}`);
  console.log("");
});
