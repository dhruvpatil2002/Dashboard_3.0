import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import StatusMonitoring from "../components/StatusMonitoring";
import LiveVideoFeeds from '../components/LiveVideoFeeds'
import VideoPlayer from "../components/VideoPlayer";
import RtspStreamPlayer from "../components/RtspStreamPlayer";
function DashboardHome() {
  return (
    <div className="p-4 text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard Home</h2>
      <p>This is the main page of your dashboard.</p>
    </div>
  );
}

function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-auto p-4">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="live" element={<LiveVideoFeeds />} />
          <Route path="status" element={<StatusMonitoring />} />
          <Route path="player" element={<VideoPlayer />} />
          <Route path="*" element={<Navigate to="/dashboard/" replace />} />
        </Routes>
        

      </main>
    </div>
  );
}

export default DashboardPage;
