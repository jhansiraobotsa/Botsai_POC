import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import ChatWidget from "@/components/chat-widget";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setLocation] = useLocation();

  const initial = (user?.name ?? user?.email ?? "").charAt(0).toUpperCase();

  // Logout handler  
  const { logout } = useAuth();
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <i className="fas fa-robot text-2xl text-primary mr-2"></i>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">Vyoma.ai</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Features</a>
                <a href="#pricing" className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Pricing</a>
                <a href="#docs" className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Docs</a>
                <a href="#support" className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Support</a>
              </div>
            </div>
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={toggleTheme}
                className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <i className="fas fa-sun"></i>
                ) : (
                  <i className="fas fa-moon"></i>
                )}
              </button>
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center focus:outline-none"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-label="Profile menu"
                  >
                    <span className="text-white text-sm font-medium">{initial}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-lg z-50">
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                        <div className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Dashboard</div>
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" data-testid="button-signin">Sign In</Button>
                  </Link>
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button data-testid="button-start-trial">Start Free Trial</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ChatWidget />
    </>
  );
}
