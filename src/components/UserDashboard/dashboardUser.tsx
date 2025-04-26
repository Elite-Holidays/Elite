import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const DashboardUser: React.FC = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if isSignedIn is explicitly false (not undefined)
    if (isSignedIn === false) {
      navigate("/login", { replace: true });
    }
  }, [isSignedIn, navigate]);

  // Prevent rendering anything until Clerk determines authentication state
  if (isSignedIn === undefined) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
      <p className="text-gray-600 mt-2">You are successfully logged in!</p>
    </div>
  );
};

export default DashboardUser;
