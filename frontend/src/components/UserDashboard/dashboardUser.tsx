import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import UserBookings from "./UserBookings";

const DashboardUser: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if isSignedIn is explicitly false (not undefined)
    if (isSignedIn === false) {
      navigate("/login", { replace: true });
    }
  }, [isSignedIn, navigate]);

  // Prevent rendering anything until Clerk determines authentication state
  if (isSignedIn === undefined) return (
    <div className="min-h-screen pt-24 bg-gray-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your bookings and account information</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.fullName || 'User'}</h2>
              <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <UserBookings />
      </div>
    </div>
  );
};

export default DashboardUser;
