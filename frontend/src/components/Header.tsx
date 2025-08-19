import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCircleUser, FaBars, FaTimes } from "react-icons/fa6";
import { useUser, useClerk, SignInButton } from "@clerk/clerk-react"; // Clerk authentication hooks

interface HeaderProps {
  scrollToPopularTrips?: () => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToPopularTrips }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false); // Check if user is logged in
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu state
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    
    // Add event listener when menu is open
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  
  // Function to close menu
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  // Function to handle navigation and close the menu
  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
    closeMobileMenu();
  };
  
  // Function to handle sign out and close menu
  const handleSignOut = () => {
    signOut();
    closeMenu();
  };
  
  // Function to handle popular trips navigation
  const handlePopularTripsClick = () => {
    if (location.pathname === "/") {
      // If already on home page, just scroll
      if (scrollToPopularTrips) {
        scrollToPopularTrips();
      }
    } else {
      // If on another page, navigate to home and then scroll
      navigate("/", { state: { scrollToPopularTrips: true } });
    }
    closeMobileMenu();
  };
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-md z-50">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-black hover:scale-105 transition-transform"
            >
              Elite Holidays
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              {[
                { name: "HOME", path: "/" },
                {
                  name: "POPULAR TRIPS",
                  path: "#",
                  onClick: handlePopularTripsClick,
                },
                { name: "CONTACT", path: "/contact" },
                { name: "ABOUT", path: "/about" },
              ].map(({ name, path, onClick }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={(e) => {
                    if (onClick) {
                      e.preventDefault();
                      onClick();
                    }
                  }}
                  className="relative text-gray-800 hover:text-gray-900 py-2 group"
                >
                  {name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-800 hover:text-gray-900"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            
            {/* Right: Profile Dropdown or Login */}
            <div className="relative" ref={menuRef}>
            {isSignedIn ? (
              <div>
                {/* Profile Icon */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user?.imageUrl || ""}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                </button>

                {/* Custom Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2">
                    <p className="px-3 py-2 text-gray-700 font-semibold">
                      {user?.fullName}
                    </p>
                    <button
                      onClick={() => handleNavigation(user?.publicMetadata?.role === "admin" ? "/admin" : "/dashboard")}
                      className="w-full text-left block px-3 py-2 hover:bg-gray-100 rounded-md text-gray-700"
                    >
                      {user?.publicMetadata?.role === "admin"
                        ? "Admin Panel"
                        : "Dashboard"}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-lg px-8 py-2 bg-[#4624c1] text-white hover:bg-[#5a6ad8] transition-all duration-300 flex items-center gap-x-2">
                  <FaCircleUser />
                  <span>Sign in</span>
                </button>
              </SignInButton>
            )}
          </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <nav className="px-4 py-4 space-y-2">
              {[
                { name: "HOME", path: "/" },
                {
                  name: "POPULAR TRIPS",
                  path: "#",
                  onClick: handlePopularTripsClick,
                },
                { name: "CONTACT", path: "/contact" },
                { name: "ABOUT", path: "/about" },
              ].map(({ name, path, onClick }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={(e) => {
                    if (onClick) {
                      e.preventDefault();
                      onClick();
                    } else {
                      closeMobileMenu();
                    }
                  }}
                  className="block py-3 px-2 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
