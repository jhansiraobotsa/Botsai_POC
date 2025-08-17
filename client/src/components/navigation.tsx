import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setLocation] = useLocation();

  const initial = (user?.name ?? user?.email ?? "").charAt(0).toUpperCase();

  // Logout handler
  const handleLogout = () => {
    // Remove session and redirect to login
    fetch("/api/logout", { method: "POST" })
      .then(() => {
        setDropdownOpen(false);
        setLocation("/login");
        window.location.reload(); // Ensure state is reset
      });
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <i className="fas fa-robot text-2xl text-primary mr-2"></i>
                <span className="text-xl font-bold text-slate-900">BOTSAi</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#docs" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Docs</a>
              <a href="#support" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Support</a>
            </div>
          </div>
          <div className="flex items-center space-x-4 relative">
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
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg z-50">
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                      <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">Dashboard</div>
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 cursor-pointer"
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
  );
}
