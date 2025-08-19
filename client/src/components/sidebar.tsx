import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";

export default function Sidebar() {
  const [location] = useLocation();
  const { theme } = useTheme();
  return (
    <div className={
      `w-64 border-r h-[calc(100vh-4rem)] ` +
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
          <span>My Chatbots</span>
        </Link>
        <Link
          to="/create"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"} ${location === "/create" ? (theme === "dark" ? "bg-slate-800" : "bg-slate-100") : ""}`}
        >
          <i className="fas fa-plus"></i>
          <span>Create New</span>
        </Link>
        <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`}>
          <i className="fas fa-chart-bar"></i>
          <span>Analytics</span>
        </button>
        <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`}>
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}
