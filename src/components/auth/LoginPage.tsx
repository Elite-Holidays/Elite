import React, { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [role, setRole] = useState<"admin" | "user" | null>(null);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            {!role ? (
                // Role Selection UI
                <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl text-center">
                    <h2 className="text-xl font-semibold mb-4">Choose Your Login</h2>
                    <button
                        className="w-full py-2 mb-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => setRole("user")}
                    >
                        Member Login
                    </button>
                    <button
                        className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => setRole("admin")}
                    >
                        Admin Login
                    </button>
                </div>
            ) : (
                // Sign-in UI (Appears after user selects a role)
                <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">
                        {role === "admin" ? "Admin Sign In" : "Member Sign In"}
                    </h2>
                    <SignIn 
                        signUpUrl="/register" 
                        afterSignInUrl={role === "admin" ? "/admin" : "/dashboard"} 
                    />
                    <button 
                        className="mt-4 text-blue-600 underline" 
                        onClick={() => setRole(null)}
                    >
                        Go Back
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
