import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";

export default function Sidebar() {
  const [location] = useLocation();
  const { theme } = useTheme();
  return (
    <div className={
      `w-64 border-r h-full overflow-y-auto ` +
      (theme === "dark"
        ? "bg-slate-900 border-slate-800"
        : "bg-slate-50 border-slate-200")
    }>
      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"} ${location === "/dashboard" ? (theme === "dark" ? "bg-slate-800" : "bg-slate-100") : ""}`}
        >
          <i className="fas fa-robot"></i>
          <span>My AI Agents</span>
        </Link>
        <Link
          to="/select-agent"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"} ${location === "/select-agent" || location === "/create" || location.startsWith("/database-agent") ? (theme === "dark" ? "bg-slate-800" : "bg-slate-100") : ""}`}
        >
          <i className="fas fa-plus"></i>
          <span>Deploy Agent</span>
        </Link>
        <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`}>
          <i className="fas fa-chart-bar"></i>
          <span>Intelligence Hub</span>
        </button>
        <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`}>
          <i className="fas fa-cog"></i>
          <span>Configuration</span>
        </button>
      </nav>
    </div>
  );
}
