import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-32 pb-16 px-4 lg:px-8">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600">Last updated: <span className="font-medium">February 26, 2025</span></p>
                </div>

                {/* Content Sections */}
                <div className="mt-12 space-y-8">
                    {/* Section 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Name and contact information</li>
                            <li>Enquiry details and preferences</li>
                            <li>Communication history</li>
                            <li>Service interests</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Respond to your enquiries</li>
                            <li>Provide you with relevant service details</li>
                            <li>Personalize your experience</li>
                            <li>Send updates and offers (with your consent)</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Your Rights</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your information</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
