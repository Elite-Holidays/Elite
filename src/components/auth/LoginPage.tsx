import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

const LoginPage: React.FC = () => {
    const location = useLocation();
    
    // Get the redirect path from state or use default paths
    const from = location.state?.from || "/";
    const isAdminPath = from.startsWith("/admin");

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div >


                <SignIn 
                    signUpUrl="/register" 
                    afterSignInUrl={from}
                />
            </div>
        </div>
    );
};

export default LoginPage;
