import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiBookOpen } from "react-icons/fi";
import { Moon, Sun, X, Globe } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import appConfig from "../../config/appConfig";
import { useAuthStore } from "../../store/useAuthStore";
import { getInitials } from "../../utils/getInitials";
import { motion, AnimatePresence } from "framer-motion";
import { navigation } from "../../config/navigation";

const Header = () => {
  const { 
    theme, 
    toggleTheme, 
    isMobileMenuOpened: isMobileMenuOpen, 
    setMobileMenuOpened: setIsMobilemenuOpen 
  } = useUiStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const headerRef = useRef(null);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsMobilemenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsMobilemenuOpen]);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobilemenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsMobilemenuOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 p-4">
      <div className="max-w-7xl mx-auto relative">
        {/* Main Navbar Bar */}
        <div className="bg-primary text-primary-content rounded-full shadow-lg px-5 py-2.5 flex items-center justify-between relative">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              {appConfig.app.logo ? (
                <img src={appConfig.logo} alt="logo" className="h-10 w-10" />
              ) : (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-base-100/25 flex items-center justify-center text-primary-content shadow-inner">
                    <FiBookOpen size={16} />
                  </div>
                </div>
              )}

              <span className="font-bold text-lg hidden sm:block">
                {appConfig.app.name}
              </span>
            </Link>
          </div>

          {/* Center: Dynamic Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {navigation.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`hover:text-primary transition-colors ${
                  location === item.path ? "text-white font-bold" : "text-white/80"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Desktop Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex btn btn-outline btn-soft border-none btn-circle btn-xs"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-primary-content" />
              ) : (
                <Moon size={16} className="text-primary-content" />
              )}
            </button>

            {/* Desktop Auth */}
            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="hidden md:flex btn btn-sm btn-circle overflow-hidden shadow-none hover:ring-1 hover:ring-offset-2 hover:ring-base-300 cursor-pointer btn-primary"
              >
                <img
                  src={`https://placehold.co/600x400?text=${getInitials(user?.name) || "KS"}`}
                  alt="avatar"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:flex btn btn-primary btn-sm rounded-full px-4"
              >
                Login
              </button>
            )}

            {/* Mobile Dropdown Menu Button */}
            <button
              onClick={() => setIsMobilemenuOpen(!isMobileMenuOpen)}
              className="lg:hidden btn btn-outline btn-soft border-none btn-circle btn-xs text-primary-content transition-transform duration-200"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu style from user's request */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-3 bg-primary backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden text-primary-content absolute w-full"
            >
              <div className="p-4 space-y-2">
                {/* Dynamic Navigation Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobilemenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl hover:bg-white/10 transition-colors font-semibold ${
                      location === item.path ? "bg-white/15 text-white" : "text-white/80"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 font-semibold text-white/90"
                >
                  <span className="p-2 rounded-lg bg-white/10">
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  </span>
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>

                {/* Language (Mock Selector matching user design layout) */}
                <button className="w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 font-semibold text-white/90">
                  <span className="p-2 rounded-lg bg-white/10">
                    <Globe size={16} />
                  </span>
                  <span>English</span>
                </button>

                {/* Auth Buttons */}
                {!user ? (
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMobilemenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMobilemenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all"
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/15">
                      <img
                        src={`https://placehold.co/100x100?text=${getInitials(user.name)}`}
                        className="w-10 h-10 rounded-full border border-white/20 shrink-0"
                        alt="avatar"
                      />
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">{user.name}</div>
                        <div className="text-xs text-white/70 truncate max-w-[180px]">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobilemenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full px-4 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all"
                    >
                      Profile
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
