import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiUrl } from "../utils/apiConfig";

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
  travelType: string;
}

const MoreDestinations: React.FC = () => {
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
        const response = await fetch(getApiUrl("/api/travelPackages"));
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data: TravelPackage[] = await response.json();

        setAllTrips(data);
        setGroupTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTrips();
  }, []);

  // Update trips when activeTab changes
  useEffect(() => {
    if (activeTab === "all") {
      setGroupTrips(allTrips);
    } else {
      setGroupTrips(
        allTrips.filter((pkg) => pkg.travelType?.toLowerCase() === activeTab)
      );
    }
    setCurrentPage(0);
  }, [activeTab, allTrips]);

  const totalPages = Math.ceil(groupTrips.length / itemsPerPage);
  const paginatedItems = groupTrips.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="py-6 pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Explore All Trips
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Find the best group trips for your next adventure
          </p>
        </div>

        {/* Filter Tabs - Mobile Optimized */}
        <div className="flex justify-center mb-6">
          <div className="bg-white shadow-md border border-gray-200 rounded-lg p-1 w-full max-w-sm sm:max-w-md">
            <div className="grid grid-cols-3 gap-1">
              {[
                { key: "all", label: "All", icon: "🌍" },
                { key: "domestic", label: "Domestic", icon: "🏡" },
                { key: "international", label: "International", icon: "✈️" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`px-2 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md text-center
                    ${
                      activeTab === tab.key
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-sm">{tab.icon}</span>
                    <span className="leading-none">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Loading trips...</p>
          </div>
        ) : (
          <>
            {/* Trip Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 text-xs font-semibold rounded-md shadow-sm">
                        ★ {pkg.rating}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {pkg.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                          <span className="mr-1">📍</span>
                          {pkg.location}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                          <span className="mr-1">⏱️</span>
                          {pkg.duration}
                        </p>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                        {pkg.description}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-lg sm:text-xl font-bold text-blue-600">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        <button
                          className="bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-all text-xs sm:text-sm font-medium"
                          onClick={() =>
                            pkg._id
                              ? navigate(`/packages/${pkg._id}`)
                              : console.error("Invalid ID:", pkg)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-600 text-lg">No trips found</p>
                  <p className="text-gray-500 text-sm mt-2">Try selecting a different filter</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center">
                <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentPage === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                      currentPage === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    ←
                  </button>

                  {/* Page Numbers - Show only 5 pages on mobile */}
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                    let pageIndex = index;
                    
                    // Adjust page numbers for large page counts
                    if (totalPages > 5) {
                      if (currentPage < 3) {
                        pageIndex = index;
                      } else if (currentPage >= totalPages - 2) {
                        pageIndex = totalPages - 5 + index;
                      } else {
                        pageIndex = currentPage - 2 + index;
                      }
                    }

                    return (
                      <button
                        key={pageIndex}
                        onClick={() => setCurrentPage(pageIndex)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all ${
                          currentPage === pageIndex
                            ? "bg-blue-500 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageIndex + 1}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                      currentPage === totalPages - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all text-sm font-medium flex items-center space-x-2"
          >
            <span>←</span>
            <span>Go Back</span>
          </button>
        </div>

        {/* Modal - Mobile Optimized */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900 pr-4 leading-tight">
                    {selectedPackage.title}
                  </h2>
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl leading-none p-1"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-20">Location:</span>
                    <span className="text-gray-600">{selectedPackage.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-20">Duration:</span>
                    <span className="text-gray-600">{selectedPackage.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-20">Type:</span>
                    <span className="text-gray-600 capitalize">{selectedPackage.travelType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-20">Price:</span>
                    <span className="text-blue-600 font-bold">₹{selectedPackage.price.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Description:</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedPackage.description}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                  >
                    Close
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all text-sm font-medium text-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MoreDestinations;
