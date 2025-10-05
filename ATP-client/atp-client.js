/**
 * ATP Client v1
 * by Wataamee777
 */

(function (global) {
  const ATP = {
    connect(url) {
      if (!url.startsWith("atp://"))
        throw new Error("Invalid ATP URL (must start with atp://)");

      const wsUrl = url.replace("atp://", "ws://");
      const ws = new WebSocket(wsUrl);
      const audioChunks = [];
      ws.binaryType = "arraybuffer";

      ws.onopen = () => console.log(`🔗 Connected to ${url}`);
      ws.onclose = () => console.log(`🚪 Disconnected`);
      ws.onerror = (e) => console.error(`⚠️ Error:`, e);

      ws.onmessage = (e) => {
        audioChunks.push(e.data);
        if (audioChunks.length >= 15) {
          const blob = new Blob(audioChunks, { type: "audio/mpeg" });
          const audio = new Audio(URL.createObjectURL(blob));
          audio.play();
          audioChunks.length = 0;
        }
      };
    },
  };

  global.ATP = ATP;
})(typeof window !== "undefined" ? window : global);
