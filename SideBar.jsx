import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiVideo, FiActivity, FiPlayCircle } from 'react-icons/fi';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-gray-900 text-gray-200 min-h-screen transition-width duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } shadow-lg`}
      aria-label="Main Sidebar"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        {!isCollapsed && (
          <span className="font-extrabold text-xl tracking-wide select-none">AI Surveillance</span>
        )}
        <button
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <nav className="flex-1 flex flex-col mt-6 space-y-2 px-2">
        <NavLink
          to="live"
          className={({ isActive }) =>
            `flex items-center gap-4 rounded-md p-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
            }`
          }
          title="Live Video Feed"
        >
          <FiVideo className="text-lg" />
          {!isCollapsed && 'Live Video Feed'}
        </NavLink>

        <NavLink
          to="status"
          className={({ isActive }) =>
            `flex items-center gap-4 rounded-md p-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
            }`
          }
          title="Status Monitoring"
        >
          <FiActivity className="text-lg" />
          {!isCollapsed && 'Status Monitoring'}
        </NavLink>

        <NavLink
          to="player"
          className={({ isActive }) =>
            `flex items-center gap-4 rounded-md p-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
            }`
          }
          title="Video Player"
        >
          <FiPlayCircle className="text-lg" />
          {!isCollapsed && 'Video Player'}
        </NavLink>
      </nav>

      {!isCollapsed && (
        <footer className="p-4 text-xs text-gray-400 border-t border-gray-700 mt-auto select-none">
          &copy; {new Date().getFullYear()} AI Surveillance
        </footer>
      )}
    </aside>
  );
}
