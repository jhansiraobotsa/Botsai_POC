// import { Button } from "@/components/ui/button";
// import { Link, useLocation } from "wouter";
// import { useAuth } from "@/hooks/useAuth";
// import { useState } from "react";
// import { useTheme } from "@/components/theme-provider";
// import ChatWidget from "@/components/chat-widget";

// export default function Navigation() {
//   const { user, isAuthenticated } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [, setLocation] = useLocation();

//   const initial = (user?.name ?? user?.email ?? "").charAt(0).toUpperCase();

//   // Logout handler  
//   const { logout } = useAuth();
//   const handleLogout = () => {
//     setDropdownOpen(false);
//     setMobileMenuOpen(false);
//     logout();
//   };

//   const closeMobileMenu = () => setMobileMenuOpen(false);

//   return (
//     <>
//       <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center">
//               <Link to="/">
//                 <div className="flex-shrink-0 flex items-center cursor-pointer">
//                   <i className="fas fa-robot text-2xl text-primary mr-2"></i>
//                   <span className="text-xl font-bold text-slate-900 dark:text-white">Vyoma.ai</span>
//                 </div>
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:block">
//               <div className="ml-10 flex items-baseline space-x-6">
//                 <Link to="/features">
//                   <a className="text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Platform</a>
//                 </Link>
//                 <Link to="/pricing">
//                   <a className="text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
//                 </Link>
//                 <Link to="/documentation">
//                   <a className="text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Resources</a>
//                 </Link>
//                 <Link to="/about">
//                   <a className="text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">About</a>
//                 </Link>
//                 <Link to="/contact">
//                   <a className="text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Contact</a>
//                 </Link>
//               </div>
//             </div>

//             {/* Right Side Actions */}
//             <div className="flex items-center space-x-4 relative">
//               {/* Theme Toggle */}
//               <button
//                 onClick={toggleTheme}
//                 className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none transition-colors"
//                 title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
//               >
//                 {theme === "dark" ? (
//                   <i className="fas fa-sun"></i>
//                 ) : (
//                   <i className="fas fa-moon"></i>
//                 )}
//               </button>

//               {/* User Menu or Auth Buttons */}
//               {isAuthenticated && user ? (
//                 <div className="relative hidden md:block">
//                   <button
//                     className="w-8 h-8 bg-primary rounded-full flex items-center justify-center focus:outline-none hover:scale-105 transition-transform"
//                     onClick={() => setDropdownOpen((v) => !v)}
//                     aria-label="Profile menu"
//                   >
//                     <span className="text-white text-sm font-medium">{initial}</span>
//                   </button>
//                   {dropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
//                       <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
//                         <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || user?.email}</p>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
//                       </div>
//                       <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
//                         <div className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm">
//                           <i className="fas fa-th-large mr-2"></i>Dashboard
//                         </div>
//                       </Link>
//                       <button
//                         className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-red-600 dark:text-red-400"
//                         onClick={handleLogout}
//                       >
//                         <i className="fas fa-sign-out-alt mr-2"></i>Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="hidden md:flex items-center space-x-3">
//                   <Link to="/login">
//                     <Button variant="ghost" size="sm" data-testid="button-signin">Sign In</Button>
//                   </Link>
//                   <Link to={isAuthenticated ? "/dashboard" : "/register"}>
//                     <Button size="sm" data-testid="button-start-trial">Start Free Trial</Button>
//                   </Link>
//                 </div>
//               )}

//               {/* Mobile Hamburger */}
//               <button
//                 className="md:hidden text-slate-700 dark:text-slate-200 focus:outline-none"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 aria-label="Toggle mobile menu"
//               >
//                 {mobileMenuOpen ? (
//                   <i className="fas fa-times text-xl"></i>
//                 ) : (
//                   <i className="fas fa-bars text-xl"></i>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Link to="/features">
//                 <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                   Platform
//                 </a>
//               </Link>
//               <Link to="/pricing">
//                 <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                   Pricing
//                 </a>
//               </Link>
//               <Link to="/documentation">
//                 <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                   Resources
//                 </a>
//               </Link>
//               <Link to="/about">
//                 <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                   About
//                 </a>
//               </Link>
//               <Link to="/contact">
//                 <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                   Contact
//                 </a>
//               </Link>
              
//               {/* Mobile Auth Buttons */}
//               <div className="border-t border-slate-200 dark:border-slate-800 pt-4 pb-3 space-y-2">
//                 {isAuthenticated && user ? (
//                   <>
//                     <div className="px-3 py-2">
//                       <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || user?.email}</p>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
//                     </div>
//                     <Link to="/dashboard">
//                       <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                         <i className="fas fa-th-large mr-2"></i>Dashboard
//                       </a>
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
//                     >
//                       <i className="fas fa-sign-out-alt mr-2"></i>Logout
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link to="/login">
//                       <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
//                         Sign In
//                       </a>
//                     </Link>
//                     <Link to="/register">
//                       <a onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90">
//                         Start Free Trial
//                       </a>
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//       <ChatWidget />
//     </>
//   );
// }


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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const initial = (user?.name ?? user?.email ?? "").charAt(0).toUpperCase();

  // Navigation items with their paths
  const navItems = [
    { path: "/features", label: "Platform" },
    { path: "/pricing", label: "Pricing" },
    { path: "/documentation", label: "Resources" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" }
  ];

  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  // Logout handler  
  const { logout } = useAuth();
  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <i className="fas fa-robot text-2xl text-primary mr-2"></i>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">Vyoma.ai</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <a
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "text-primary border-b-2 border-primary"
                          : "text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 relative">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none transition-colors"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <i className="fas fa-sun"></i>
                ) : (
                  <i className="fas fa-moon"></i>
                )}
              </button>

              {/* User Menu or Auth Buttons */}
              {isAuthenticated && user ? (
                <div className="relative hidden md:block">
                  <button
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center focus:outline-none hover:scale-105 transition-transform"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-label="Profile menu"
                  >
                    <span className="text-white text-sm font-medium">{initial}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || user?.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                        <div className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm">
                          <i className="fas fa-th-large mr-2"></i>Dashboard
                        </div>
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-red-600 dark:text-red-400"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" data-testid="button-signin">Sign In</Button>
                  </Link>
                  <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                    <Button size="sm" data-testid="button-start-trial">Start Free Trial</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                className="md:hidden text-slate-700 dark:text-slate-200 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <i className="fas fa-times text-xl"></i>
                ) : (
                  <i className="fas fa-bars text-xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <a
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.path)
                        ? "text-primary bg-slate-50 dark:bg-slate-800"
                        : "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 pb-3 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || user?.email}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <Link to="/dashboard">
                      <a 
                        onClick={closeMobileMenu} 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/dashboard")
                            ? "text-primary bg-slate-50 dark:bg-slate-800"
                            : "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <i className="fas fa-th-large mr-2"></i>Dashboard
                      </a>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <a 
                        onClick={closeMobileMenu} 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/login")
                            ? "text-primary bg-slate-50 dark:bg-slate-800"
                            : "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        Sign In
                      </a>
                    </Link>
                    <Link to="/register">
                      <a 
                        onClick={closeMobileMenu} 
                        className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
                      >
                        Start Free Trial
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <ChatWidget />
    </>
  );
}