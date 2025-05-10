import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon, CalendarIcon, StarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/clerk-react";

interface ItineraryDetails {
  day: string;
  date: string;
  details: string;
}

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
  itinerary: ItineraryDetails[];
  createdAt: string;
  updatedAt: string;
}

const ShowPackages: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: "/admin/packages" } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  useEffect(() => {
    // Only fetch packages if user is admin
    if (!isLoaded || !isAdmin) return;
    
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/travelpackages");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data: TravelPackage[] = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, [isLoaded, isAdmin]);

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/travelpackages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete package");
      setPackages((prevPackages) => prevPackages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleEditPackage = (id: string) => {
    navigate(`/admin/edit-package/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50 p-4 sm:p-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Admin</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
            Travel Packages Management
          </h1>
          <div className="w-full sm:w-auto flex justify-end">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
              {packages.length} {packages.length === 1 ? 'Package' : 'Packages'}
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No packages found</h3>
            <p className="text-gray-500">Create your first travel package to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* Package Image */}
                <div className="relative h-48 w-full">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{pkg.title}</h3>
                    <p className="text-gray-200">{pkg.location}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur px-2 py-1 rounded-full">
                    <span className="text-yellow-500">
                      <StarIcon className="h-4 w-4 fill-current" />
                    </span>
                    <span className="ml-1 text-sm font-medium text-gray-900">{pkg.rating}</span>
                  </div>
                </div>

                {/* Package Details */}
                <div className="p-5">
                  {/* Price and Duration */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{pkg.price.toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {pkg.duration}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

                  {/* Trip Type Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {pkg.tripType}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {pkg.travelType}
                    </span>
                  </div>

                  {/* Details Accordions */}
                  <div className="space-y-3">
                    {/* Itinerary */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="font-medium text-gray-700">Itinerary</span>
                          </div>
                          <svg className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-4 pb-3">
                          <ul className="space-y-2 text-sm">
                            {pkg.itinerary.map((item, index) => (
                              <li key={index} className="text-gray-600 pl-7 relative">
                                <div className="absolute left-0 top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                <strong className="text-gray-800">Day {item.day}:</strong> {item.details} ({item.date})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => handleEditPackage(pkg._id)}
                      className="flex-1 mr-2 py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id)}
                      className="flex-1 ml-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <div className="flex items-center justify-center">
                        <TrashIcon className="h-5 w-5 mr-1" />
                        Delete
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPackages;