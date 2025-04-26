import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { useUser, useClerk } from "@clerk/clerk-react"; // Clerk authentication hooks

interface HeaderProps {
  scrollToPopularTrips?: () => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToPopularTrips }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false); // Check if user is logged in
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-black hover:scale-105 transition-transform"
            >
              Elite Holidays
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              {[
                { name: "HOME", path: "/" },
                {
                  name: "POPULAR TRIPS",
                  path: "#",
                  onClick: scrollToPopularTrips,
                },
                { name: "EXPERIENCES", path: "/experiences" },
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
          </div>
          {/* Right: Profile Dropdown or Login */}
          <div className="relative">
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
                    <Link
                      to={
                        user?.publicMetadata?.role === "admin"
                          ? "/admin"
                          : "/dashboard"
                      }
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md text-gray-700"
                    >
                      {user?.publicMetadata?.role === "admin"
                        ? "Admin Panel"
                        : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="rounded-lg px-8 py-2 bg-[#4624c1] text-white hover:bg-[#5a6ad8] transition-all duration-300 flex items-center gap-x-2">
                  <FaCircleUser />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
