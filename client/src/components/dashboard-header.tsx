import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => setLocation("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <i className="fas fa-robot text-white text-lg"></i>
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-tight">Vyoma.ai</span>
              <span className="block text-xs text-slate-400">Agent Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-lg p-2.5 focus:outline-none transition-all"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <i className="fas fa-sun"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg px-3 py-2 focus:outline-none transition-all"
                onClick={() => setShowProfile((v) => !v)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-white">{user?.name || "User"}</div>
                  <div className="text-xs text-slate-400 capitalize">{user?.plan || "Free"} Plan</div>
                </div>
                <i className={`fas fa-chevron-down text-slate-400 text-xs transition-transform ${showProfile ? 'rotate-180' : ''}`}></i>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-primary text-lg font-bold">
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user?.name || user?.email}</div>
                        <div className="text-xs text-white/80">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Current Plan</span>
                      <span className="text-sm font-semibold text-primary capitalize">{user?.plan || "Free"}</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => {
                        setShowProfile(false);
                        setLocation("/dashboard");
                      }}
                    >
                      <i className="fas fa-robot w-5 mr-3 text-slate-400"></i>
                      My AI Agents
                    </button>
                    <button
                      className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => {
                        setShowProfile(false);
                        setLocation("/select-agent");
                      }}
                    >
                      <i className="fas fa-plus w-5 mr-3 text-slate-400"></i>
                      Deploy New Agent
                    </button>
                    <button className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <i className="fas fa-cog w-5 mr-3 text-slate-400"></i>
                      Configuration
                    </button>
                    <button className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <i className="fas fa-credit-card w-5 mr-3 text-slate-400"></i>
                      Billing
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                      data-testid="button-logout"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
