import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, adminOnly = false }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      if (adminOnly) {
        // Check if user has admin role
        const isAdmin = user?.publicMetadata?.role === "admin";
        setIsAuthorized(isAdmin);
      } else {
        // Any signed in user
        setIsAuthorized(true);
      }
      
      setIsChecking(false);
    }
  }, [isLoaded, isSignedIn, user, adminOnly]);

  if (isChecking) {
    // Show loading state while checking auth
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    // If not signed in, redirect to login page
    if (!isSignedIn) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    // If signed in but not authorized (trying to access admin pages without admin role)
    if (adminOnly) {
      return <Navigate to="/" state={{ error: "You don't have permission to access this Admin area." }} replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard; 