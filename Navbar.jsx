import React, { useState } from "react";

export default function Navbar({ sidebarCollapsed, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow-md sticky top-0 z-30">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4">
        {/* Hamburger toggle button */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1 hover:bg-gray-700 transition"
        >
          {sidebarCollapsed ? (
            <span className="text-2xl select-none">➡️</span>
          ) : (
            <span className="text-2xl select-none">⬅️</span>
          )}
        </button>

        {/* Project title */}
        <h1 className="text-xl font-semibold select-none">AI Surveillance Dashboard</h1>
      </div>

      {/* Right: Notifications + User menu */}
      <div className="flex items-center gap-4 relative">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            className="h-6 w-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Notification dot example */}
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1 hover:bg-gray-700 transition"
          >
            {/* User icon placeholder */}
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold select-none">
              U
            </div>
            <span className="sr-only">Open user menu</span>
            <svg
              className={`w-4 h-4 text-gray-300 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <ul
              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg text-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu"
              aria-orientation="vertical"
              aria-label="User menu"
            >
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" role="menuitem">
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" role="menuitem">
                Settings
              </li>
              <li className="border-t border-gray-200"></li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" role="menuitem">
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
