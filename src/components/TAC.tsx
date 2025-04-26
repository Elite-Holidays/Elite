import React from "react";
import Header from "./Header";

const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header /> {/* ✅ Keep the header for navigation */}

            <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms & Conditions</h1>
                    <p className="text-lg text-gray-600">Last updated: <span className="font-medium">February 26, 2025</span></p>
                </div>

                {/* Content Sections */}
                <div className="mt-12 space-y-8">
                    {/* Section 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Booking Terms</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Provide accurate information for all travelers.</li>
                            <li>Pay all fees and charges when due.</li>
                            <li>Comply with all travel requirements.</li>
                            <li>Accept our cancellation and refund policies.</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Payment & Cancellation</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>30% deposit required at booking.</li>
                            <li>Full payment due 60 days before departure.</li>
                            <li>Free cancellation up to 90 days before departure.</li>
                            <li>Partial refunds for cancellations 60-89 days before departure.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Travel Insurance</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Purchase comprehensive travel insurance.</li>
                            <li>Review coverage details carefully.</li>
                            <li>Understand medical evacuation coverage.</li>
                            <li>Consider trip cancellation protection.</li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Liability</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Elite Holidays acts as an agent for travel service providers.</li>
                            <li>We are not liable for third-party service failures.</li>
                            <li>We recommend appropriate travel insurance coverage.</li>
                            <li>We reserve the right to modify itineraries when necessary.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
