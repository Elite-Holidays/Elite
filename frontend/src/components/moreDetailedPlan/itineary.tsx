import React from "react";

// Define the interface directly here since we no longer import from packageDetails
interface PackageDetailsProps {
  _id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  description: string;
  tripType: string;
  travelType: string;
  itineraryMode: "manual" | "pdf";
  itineraryPdf?: string;
  itinerary: { day: number; details: string; activities?: string[] }[];
  createdAt: string;
  updatedAt: string;
}

interface ItineraryPageProps {
  packageTravel: PackageDetailsProps;
}

const ItineraryPage: React.FC<ItineraryPageProps> = ({ packageTravel }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {packageTravel.title}
        </h1>
        <div className="flex justify-center items-center gap-4 text-gray-600">
          <span>{packageTravel.location}</span>
          <span>•</span>
          <span>{packageTravel.duration}</span>
          <span>•</span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {packageTravel.rating}
          </span>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Trip Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Trip Type</h3>
            <p className="text-gray-900 font-semibold">
              {packageTravel.tripType}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Travel Type</h3>
            <p className="text-gray-900 font-semibold">
              {packageTravel.travelType}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Price</h3>
            <p className="text-blue-600 font-bold text-xl">
              ₹{packageTravel.price}
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Your Itinerary
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200 md:left-1/2 md:-ml-1"></div>

          {packageTravel.itinerary.map((item: { day: number; details: string; activities?: string[] }, index: number) => (
            <div key={index} className="relative mb-8">
              <div
                className={`flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Day Circle */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold z-10 mx-auto md:mx-0">
                  {item.day}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:pl-8 md:pr-4" : "md:pr-8 md:pl-4"
                  } mt-4 md:mt-0`}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Day {item.day}
                    </h3>
                    <p className="text-gray-600">{item.details}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
          Book This Package
        </button>
      </div>
    </div>
  );
};

export default ItineraryPage;
