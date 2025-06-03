import React from "react";
import { SignUp } from "@clerk/clerk-react";
 import { useNavigate } from "react-router-dom"; 

const RegisterPage: React.FC = () => {
   const navigate = useNavigate(); 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">
        <SignUp
          
          signInUrl="/login"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
};

export default RegisterPage;