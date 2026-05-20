import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LayoutDashboard, Code2, FolderOpen, User, LogOut } from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/reviewer",  icon: Code2,           label: "Reviewer"  },
  { to: "/workspace", icon: FolderOpen,       label: "Workspace" },
  { to: "/profile",   icon: User,             label: "Profile"   },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 bg-[#0d0d14] border-r border-white/[0.05] flex flex-col h-screen fixed select-none">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M3 8h7M3 12h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="13" cy="12" r="2" fill="white"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">ReviewForge</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-100 ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? "text-blue-400" : "text-zinc-500"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-white/[0.05] space-y-0.5">
        {/* User pill */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 text-[10px] font-bold uppercase">
              {user?.name?.[0] ?? "U"}
            </span>
          </div>
          <span className="text-zinc-400 text-[12px] truncate">{user?.name ?? "User"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent transition-all duration-100"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}