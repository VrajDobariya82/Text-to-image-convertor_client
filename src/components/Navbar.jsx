import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { 
    user, 
    setShowLogin, 
    logout, 
    credit, 
    darkMode, 
    toggleDarkMode, 
    favorites
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setShowMenu(false);
    logout();
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass py-2' : 'bg-transparent py-4 dark:bg-neutral-900/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={assets.logo}
              alt="Imagify Logo"
              className="w-28 sm:w-32 lg:w-36 transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-neutral-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Credit Button */}
                <Link
                  to="/buy"
                  className="flex items-center space-x-2 bg-primary-50 text-primary-700
                    px-4 py-2 rounded-full hover:bg-primary-100 transition-all duration-300
                    shadow-sm hover:shadow-md dark:bg-primary-900/40 dark:text-primary-300"
                >
                  <img className="w-5 h-5" src={assets.credit_star} alt="Credits" />
                  <span className="text-sm font-medium">
                    {credit} Credits
                  </span>
                </Link>

                {/* Favorites Button */}
                <Link
                  to="/favorites"
                  className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Favorites"
                >
                  <svg className="w-5 h-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* History Button */}
                <Link
                  to="/history"
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:block"
                  aria-label="History"
                >
                  <svg className="w-5 h-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 focus:outline-none group"
                  >
                    <div className="relative">
                      <img
                        src={assets.profile_icon}
                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-md
                          transition-transform duration-300 group-hover:scale-110 dark:ring-neutral-700"
                        alt="Profile"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                        rounded-full border-2 border-white dark:border-neutral-800"></div>
                    </div>
                    <span className="text-neutral-700 font-medium hidden sm:block dark:text-neutral-300">
                      {user.name}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-200 
                        ${showMenu ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" 
                        strokeWidth="2" d="M19 9l-7 7-7-7">
                      </path>
                    </svg>
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg 
                      border border-neutral-200 overflow-hidden animate-slide-up 
                      dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-purple/10
                        dark:from-primary-900/50 dark:to-accent-purple/30">
                        <p className="font-semibold text-neutral-800 dark:text-neutral-100">{user.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {navigate("/profile"); setShowMenu(false);}}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 
                            hover:bg-neutral-50 rounded-lg transition-colors
                            dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          Profile Settings
                        </button>
                        <Link
                          to="/favorites"
                          onClick={() => setShowMenu(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 
                            hover:bg-neutral-50 rounded-lg transition-colors
                            dark:text-neutral-300 dark:hover:bg-neutral-700 sm:hidden"
                        >
                          Favorites
                        </Link>
                        <Link
                          to="/history"
                          onClick={() => setShowMenu(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 
                            hover:bg-neutral-50 rounded-lg transition-colors
                            dark:text-neutral-300 dark:hover:bg-neutral-700 sm:hidden"
                        >
                          History
                        </Link>
                        <Link
                          to="/buy"
                          onClick={() => setShowMenu(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 
                            hover:bg-neutral-50 rounded-lg transition-colors
                            dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          Buy Credits
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 
                            hover:bg-red-50 rounded-lg transition-colors
                            dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/buy"
                  className="text-neutral-700 hover:text-neutral-900 font-medium 
                    transition-colors hidden sm:block dark:text-neutral-300 dark:hover:text-neutral-100"
                >
                  Pricing
                </Link>
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-primary"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
