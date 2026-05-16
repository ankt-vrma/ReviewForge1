import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import {
  LayoutDashboard,
  Code2,
  FolderOpen,
  User,
  LogOut,
  Crown,
} from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/reviewer", icon: Code2, label: "Reviewer" },
  { to: "/workspace", icon: FolderOpen, label: "Workspace" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Vertical Strip */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          open ? "w-60" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 text-white w-full"
          >
            <Crown size={24} />

            {open && (
              <span className="text-lg font-bold whitespace-nowrap">
                ReviewForge
              </span>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 mt-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              {open && (
                <span className="whitespace-nowrap">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 w-full p-2 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full"
          >
            <LogOut size={20} />

            {open && (
              <span className="whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}