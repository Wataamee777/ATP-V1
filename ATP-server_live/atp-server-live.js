/**
 * atp-server-live.js
 * ATP v1 Live Mic Server
 * Usage: node atp-server-live.js
 */

import fs from "fs";
import { execSync } from "child_process";

let WebSocket, WebSocketServer, Mic;
try {
  WebSocket = (await import("ws")).default;
  WebSocketServer = (await import("ws")).WebSocketServer;
  Mic = (await import("mic")).default;
} catch (err) {
  console.log("📦 Required modules missing. Installing...");
  execSync("npm install ws mic", { stdio: "inherit" });
  console.log("✅ Modules installed. Please restart the server:");
  console.log("   node atp-server-live.js");
  process.exit(0);
}

// ===== CONFIG =====
const PORT = process.env.PORT || 8080;

// ===== SERVER =====
const wss = new WebSocketServer({ port: PORT });
console.log(`🎧 ATP Live Mic Server running at atp://localhost:${PORT}/`);

wss.on("connection", ws => {
  console.log("🔗 Client connected");

  // マイク入力開始
  const micInstance = Mic({
    rate: "48000",
    channels: "1",
    debug: false,
    exitOnSilence: 0,
  });

  const micInputStream = micInstance.getAudioStream();

  micInputStream.on("data", chunk => {
    if (ws.readyState === WebSocket.OPEN) ws.send(chunk);
  });

  micInputStream.on("error", err => console.error("Mic Stream Error:", err));
  ws.on("close", () => {
    console.log("🚪 Client disconnected");
    micInstance.stop();
  });

  micInstance.start();
});

process.on("SIGINT", () => {
  console.log("\n🛑 ATP Live Mic Server stopped");
  process.exit(0);
});
