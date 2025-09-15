import React, { useState, useEffect, useRef } from "react";

// Component to stream MJPEG frames from backend WebSocket and render on canvas
const LiveStreamViewer = ({ rtspUrl }) => {
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const [status, setStatus] = useState("Disconnected");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rtspUrl) return;

    setStatus("Connecting");
    setError(null);

    // Connect to backend WebSocket server
    const ws = new WebSocket("ws://localhost:8765");
    ws.binaryType = "blob";

    ws.onopen = () => {
      setStatus("Connected");
      ws.send(rtspUrl); // Send RTSP URL to backend
    };

    ws.onmessage = async (event) => {
      try {
        const blob = event.data;
        const bitmap = await createImageBitmap(blob);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bitmap, 0, 0);
        }
      } catch (err) {
        console.error("Error rendering video frame:", err);
      }
    };

    ws.onerror = (e) => {
      setError("WebSocket error");
      setStatus("Error");
      console.error("WebSocket error:", e);
    };

    ws.onclose = () => {
      setStatus("Disconnected");
      setError(null);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      setStatus("Disconnected");
      setError(null);
      wsRef.current = null;
    };
  }, [rtspUrl]);

  return (
    <div className="space-y-1">
      <canvas
        ref={canvasRef}
        className="aspect-video bg-black rounded shadow"
        style={{ maxWidth: "100%", height: "auto" }}
        aria-label="Live RTSP Video Stream"
      />
      <p className={`text-sm ${status === "Connected" ? "text-green-600" : "text-red-600"}`}>
        Status: {error ? error : status}
      </p>
    </div>
  );
};

export default function RtspStreamingDashboard() {
  const [inputUrl, setInputUrl] = useState("");
  const [currentRtsp, setCurrentRtsp] = useState("");

  const handlePlay = () => {
    if (inputUrl.trim()) {
      setCurrentRtsp(inputUrl.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">RTSP WebSocket Streaming Player</h1>

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Enter RTSP stream URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="flex-grow border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handlePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Play
        </button>
      </div>

      <div>
        {currentRtsp ? (
          <LiveStreamViewer rtspUrl={currentRtsp} />
        ) : (
          <p className="text-gray-500">Enter an RTSP URL above and click Play to start streaming.</p>
        )}
      </div>
    </div>
  );
}
