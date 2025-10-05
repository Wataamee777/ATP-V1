/**
 * atp-server.js
 * ATP v1 Server
 * Usage: node atp-server.js ファイル名.mp3
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// ====== ws モジュール読み込み ======
let WebSocket, WebSocketServer;
try {
  WebSocket = (await import("ws")).default;
  WebSocketServer = (await import("ws")).WebSocketServer;
} catch (err) {
  console.log("📦 ws module not found. Installing...");
  execSync("npm install ws", { stdio: "inherit" });
  console.log("✅ ws installed. Please restart the server:");
  console.log("   node atp-server.js <audiofile>");
  process.exit(0);
}

// ====== CONFIG ======
const PORT = process.env.PORT || 8080;

// コマンドライン引数から音声ファイル取得
const args = process.argv.slice(2);
if (!args[0]) {
  console.error("❌ Usage: node atp-server.js <audiofile>");
  process.exit(1);
}

const AUDIO_PATH = path.resolve(args[0]);
if (!fs.existsSync(AUDIO_PATH)) {
  console.error(`❌ File not found: ${AUDIO_PATH}`);
  process.exit(1);
}

// ====== SERVER ======
const wss = new WebSocketServer({ port: PORT });
console.log(`🎧 ATP Server v1 running at atp://localhost:${PORT}/`);
console.log(`🎵 Broadcasting: ${AUDIO_PATH}`);

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`🔗 Client connected: ${ip}`);

  const stream = fs.createReadStream(AUDIO_PATH);

  stream.on("data", chunk => {
    if (ws.readyState === WebSocket.OPEN) ws.send(chunk);
  });

  stream.on("end", () => {
    console.log(`🎶 Stream finished for ${ip}`);
    ws.close();
  });

  ws.on("close", () => {
    console.log(`🚪 Disconnected: ${ip}`);
    stream.destroy();
  });
});

process.on("SIGINT", () => {
  console.log("\n🛑 ATP Server stopped");
  process.exit(0);
});
