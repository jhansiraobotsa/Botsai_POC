import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function DashboardHeader() {
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/");
  };

  return (
    <div className="bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setLocation("/")}>
          <i className="fas fa-robot text-primary text-xl"></i>
          <span className={`font-semibold text-xl tracking-wide ${theme === 'dark' ? 'text-primary' : 'text-slate-100'}`}>Vyoma.ai Dashboard</span>
        </div>
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={toggleTheme}
            className="text-white bg-slate-800 rounded-full p-2 hover:bg-slate-700 focus:outline-none"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <i className="fas fa-sun"></i>
            ) : (
              <i className="fas fa-moon"></i>
            )}
          </button>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg" onClick={() => setShowProfile((v) => !v)}>
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </span>
          </div>
          {showProfile && (
            <div className="absolute right-0 mt-12 w-64 bg-white rounded shadow-lg z-10 p-4 flex flex-col items-start border border-slate-200">
              <div className="mb-2 w-full border-b pb-2 flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{user?.name || user?.email}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                  <div className="text-xs text-slate-500 capitalize">Plan: {user?.plan}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
