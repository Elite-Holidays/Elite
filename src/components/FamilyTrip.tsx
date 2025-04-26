import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

// Define the TypeScript interface
interface TravelPackage {
  _id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  description: string;
  tripType: string;
  travelType: string; // Ensure this matches the API response
}

const FamilyTrip: React.FC = () => {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState<TravelPackage[]>([]);
  const [groupTrips, setGroupTrips] = useState<TravelPackage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  // State for modal
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(
    null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/travelPackages"
        );
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data: TravelPackage[] = await response.json();

        const filteredTrips = data.filter(
          (trip) => trip.tripType.toLowerCase() === "family trip"
        );
        setAllTrips(data);
        setGroupTrips(filteredTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTrips();
  }, []);

  const filteredItems = groupTrips.filter(
    (pkg) => activeTab === "all" || pkg.travelType?.toLowerCase() === activeTab
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="py-12 pt-20 bg-gray-50 flex justify-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-md shadow-lg border border-gray-300 rounded-full px-6 py-3 flex space-x-4 items-center relative transition-all duration-300 ring-1 ring-blue-400/50 hover:ring-blue-500/80">
            {["all", "domestic", "international"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 text-lg font-semibold transition-all duration-300 rounded-full relative
                                    ${
                                      activeTab === tab
                                        ? "bg-blue-500 text-white shadow-[0px_0px_10px_#3b82f6] transform scale-105"
                                        : "text-gray-800 hover:bg-blue-100/50"
                                    }`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(0);
                }}
              >
                {tab === "all"
                  ? "🌍 All Trips"
                  : tab === "domestic"
                  ? "🏡 Domestic"
                  : "✈️ International"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading trips...</p>
        ) : (
          <>
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900">
                Explore Group Trips
              </h2>
              <p className="text-gray-600 mt-2">
                Find the best group trips for your next adventure
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 border border-gray-200"
                  >
                    <div className="relative w-full h-[220px] overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white text-gray-800 px-3 py-1 text-xs font-bold rounded-lg shadow">
                        ★ {pkg.rating}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-blue-600">
                          ${pkg.price}
                        </span>
                        {/* Show modal on click */}
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all text-sm"
                          onClick={() =>
                            pkg._id
                              ? navigate(`/packages/${pkg._id}`)
                              : console.error("Invalid ID:", pkg)
                          }
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-3">
                  No trips found.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                    currentPage === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                      currentPage === index
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                    currentPage === totalPages - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  &rarr;
                </button>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-10 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all text-sm block mx-auto"
        >
          Go Back
        </button>

      </div>
    </section>
  );
};

export default FamilyTrip;
