import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Camera,
  Wifi,
  WifiOff,
  Circle,
  AlertTriangle,
  Trash,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LiveStreamViewer = ({ rtspUrl }) => {
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const [status, setStatus] = useState("Disconnected");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rtspUrl) return;

    setStatus("Connecting");
    setError(null);

    const ws = new WebSocket("ws://localhost:8000");
    ws.binaryType = "blob";

    ws.onopen = () => {
      setStatus("Connected");
      ws.send(rtspUrl);
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
      } catch (e) {
        console.error(e);
      }
    };

    ws.onerror = () => {
      setError("WebSocket error");
      setStatus("Error");
    };

    ws.onclose = () => {
      setStatus("Disconnected");
      setError(null);
    };

    wsRef.current = ws;

    return () => ws.close();
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
        Status: {error || status}
      </p>
    </div>
  );
};

const LiveVideoFeeds = () => {
  const [cameraFeeds, setCameraFeeds] = useState([
    {
      id: 1,
      name: "Front Gate",
      location: "Main Entrance",
      rtspUrl: "http://webcam.mchcares.com/mjpg/video.mjpg?timestamp=1566232173730",
      status: "online",
      alerts: 0,
      resolution: "1920x1080",
      fps: 25,
      lastActivity: "5 mins ago",
    },
    {
      id: 2,
      name: "Warehouse",
      location: "Storage Area",
      rtspUrl: "http://61.211.241.239/nphMotionJpeg?Resolution=320x240&Quality=Standard",
      status: "recording",
      alerts: 2,
      resolution: "1280x720",
      fps: 20,
      lastActivity: "Just now",
    },
    {
      id: 3,
      name: "Backyard",
      location: "Rear Camera",
      rtspUrl: "http://77.222.181.11:8080/mjpg/video.mjpg",
      status: "offline",
      alerts: 0,
      resolution: "640x480",
      fps: 15,
      lastActivity: "30 mins ago",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "", rtspUrl: "" });
  const [currentCameraId, setCurrentCameraId] = useState(null);

  const counts = {
    total: cameraFeeds.length,
    online: cameraFeeds.filter((c) => c.status === "online" || c.status === "recording").length,
    offline: cameraFeeds.filter((c) => c.status === "offline").length,
    recording: cameraFeeds.filter((c) => c.status === "recording").length,
  };

  const getStatusColor = (status) =>
    ({
      online: "bg-green-500/10 text-green-500 border-green-500/20",
      recording: "bg-red-500/10 text-red-500 border-red-500/20",
      offline: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }[status] || "bg-muted/10 text-muted-foreground border-muted/20");

  const getStatusIcon = (status) =>
    ({
      online: <CheckCircle className="h-3 w-3" />,
      recording: <Circle className="h-3 w-3 fill-current" />,
      offline: <WifiOff className="h-3 w-3" />,
    }[status] || <Camera className="h-3 w-3" />);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.rtspUrl) {
      alert("Fill all fields");
      return;
    }
    if (editingId) {
      setCameraFeeds((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
      setEditingId(null);
    } else {
      const newId = cameraFeeds.length ? Math.max(...cameraFeeds.map((c) => c.id)) + 1 : 1;
      setCameraFeeds((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
          status: "offline",
          alerts: 0,
          resolution: "Unknown",
          fps: 0,
          lastActivity: "Never",
        },
      ]);
    }
    setFormData({ name: "", location: "", rtspUrl: "" });
  };

  const handleEdit = (id) => {
    const cam = cameraFeeds.find((c) => c.id === id);
    if (cam) {
      setFormData({ name: cam.name, location: cam.location, rtspUrl: cam.rtspUrl });
      setEditingId(id);
    }
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure to remove this site?")) {
      setCameraFeeds((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: "", location: "", rtspUrl: "" });
      }
      if (currentCameraId === id) {
        setCurrentCameraId(null);
      }
    }
  };

  const handleSnapshot = (id) => console.log("Snapshot for camera " + id);
  const handlePlayback = (id) =>
    console.log(`Playback request for camera ${id} at ${selectedDate} ${selectedTime}`);

  const handleStreamSelect = (id) => {
    setCurrentCameraId(id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Site" : "Add New Site"}</CardTitle>
          <CardDescription>Add or edit camera info with RTSP stream URL</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Front Gate"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Main Entrance"
                required
              />
            </div>
            <div>
              <Label htmlFor="rtspUrl">RTSP Link</Label>
              <Input
                id="rtspUrl"
                name="rtspUrl"
                type="url"
                value={formData.rtspUrl}
                onChange={handleChange}
                placeholder="rtsp://user:pass@192.168.1.x:554/stream"
                required
              />
            </div>
            <div className="md:col-span-3 flex space-x-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Site" : "Add Site"}
              </Button>
              {editingId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", location: "", rtspUrl: "" });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center space-x-2">
            <Camera className="h-6 w-6 text-red-500" />
            <span>Live Video Feeds</span>
          </h3>
          <p className="text-muted-foreground">Real-time camera feeds from all locations</p>
        </div>
        <div className="flex space-x-4">
          <StatusBadge color="green" count={counts.online} label="Online" />
          <StatusBadge color="red" count={counts.recording} label="Recording" />
          <StatusBadge color="gray" count={counts.offline} label="Offline" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-purple-500" />
            <span>Playback Controls</span>
          </CardTitle>
          <CardDescription>Select date and time for playback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaybackInput label="Date" type="date" value={selectedDate} onChange={setSelectedDate} />
            <PlaybackInput label="Time" type="time" value={selectedTime} onChange={setSelectedTime} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameraFeeds.map((camera) => (
          <Card
            key={camera.id}
            className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            onClick={() => handleStreamSelect(camera.id)}
          >
            <CardHeader className="pb-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-red-500" />
                <CardTitle className="text-sm">{camera.name}</CardTitle>
              </div>
              <Badge className={getStatusColor(camera.status)} variant="secondary">
                {getStatusIcon(camera.status)}
                <span className="ml-1 capitalize">{camera.status}</span>
              </Badge>
            </CardHeader>
            <CardDescription className="px-4 text-xs">{camera.location}</CardDescription>

            <CardContent className="p-0">
              <div className="relative aspect-video bg-slate-900 group-hover:bg-slate-800 rounded-b-md overflow-hidden">
                {camera.status === "offline" ? (
                  <OfflinePlaceholder />
                ) : currentCameraId === camera.id ? (
                  <LiveStreamViewer rtspUrl={camera.rtspUrl} />
                ) : (
                  <StreamPlaceholder />
                )}
              </div>

              <div className="p-4 border-t flex justify-between items-center">
                <CameraStats resolution={camera.resolution} fps={camera.fps} />
                <div className="flex space-x-2 items-center">
                  {camera.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {camera.alerts}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(camera.id); }}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemove(camera.id); }}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2 px-4 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-purple-500/20"
                  onClick={() => handleSnapshot(camera.id)}
                  disabled={camera.status === "offline"}
                >
                  Snapshot
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border-orange-500/20"
                  onClick={() => handlePlayback(camera.id)}
                  disabled={!selectedDate || !selectedTime}
                >
                  Playback
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Small reusable components for clarity

const StatusBadge = ({ color, count, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></div>
    <span className={`text-sm text-${color}-500`}>{count} {label}</span>
  </div>
);

const PlaybackInput = ({ label, type, value, onChange }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const OfflinePlaceholder = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
    <WifiOff className="h-12 w-12 mb-2" />
    <p className="text-sm">Camera Offline</p>
  </div>
);

const StreamPlaceholder = () => (
  <div className="flex items-center justify-center h-full text-gray-700">
    Click card to view stream
  </div>
);

const CameraStats = ({ resolution, fps }) => (
  <div className="flex items-center space-x-4">
    <div className="text-center">
      <div className="text-sm font-semibold">{resolution}</div>
      <div className="text-xs text-muted-foreground">Resolution</div>
    </div>
    <div className="text-center">
      <div className="text-sm font-semibold">{fps}</div>
      <div className="text-xs text-muted-foreground">FPS</div>
    </div>
  </div>
);

export default LiveVideoFeeds;
