import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaInfoCircle,
  FaChevronRight,
  FaUmbrellaBeach,
  FaUtensils,
  FaCamera,
  FaBus,
  FaShip,
  FaUsers,
  FaDownload,
  FaExternalLinkAlt
} from "react-icons/fa";
import { getApiUrl } from "../utils/apiConfig";

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

const PackageDetails: React.FC = () => {
  const params = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const [packageTravel, setPackageTravel] = useState<PackageDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        let response;
        
        // Check if we are using slug or id route
        if (params.slug) {
          response = await fetch(getApiUrl(`/api/travelPackages/slug/${params.slug}`));
        } else if (params.id) {
          response = await fetch(getApiUrl(`/api/travelPackages/${params.id}`));
        } else {
          throw new Error("No identifier provided");
        }
        
        if (!response.ok) throw new Error("Failed to fetch package");
        const data = await response.json();
        setPackageTravel(data);

        // Update browser URL to use slug if we have one and aren't already using it
        if (data.slug && params.id && !window.location.pathname.includes('/package/')) {
          window.history.replaceState(
            null, 
            '', 
            `/package/${data.slug}`
          );
        }
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [params]);

  const getActivityIcon = (activity: string) => {
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes("beach")) return <FaUmbrellaBeach className="inline mr-2 text-blue-500" />;
    if (lowerActivity.includes("food") || lowerActivity.includes("dinner")) return <FaUtensils className="inline mr-2 text-green-500" />;
    if (lowerActivity.includes("tour") || lowerActivity.includes("sightseeing")) return <FaCamera className="inline mr-2 text-purple-500" />;
    if (lowerActivity.includes("transfer") || lowerActivity.includes("bus")) return <FaBus className="inline mr-2 text-orange-500" />;
    if (lowerActivity.includes("cruise") || lowerActivity.includes("boat")) return <FaShip className="inline mr-2 text-blue-600" />;
    return <FaChevronRight className="inline mr-2 text-gray-500" />;
  };

  // Function to download PDF with proper filename
  const downloadPdf = async (pdfUrl: string, fileName: string) => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      window.open(pdfUrl, '_blank');
    }
  };

  // Handle booking button click
  const handleBookNow = () => {
    if (packageTravel && packageTravel._id) {
      navigate(`/contact?booking=true&packageId=${packageTravel._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4" style={{ marginTop: '-80px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!packageTravel) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4" style={{ marginTop: '-80px' }}>
        <div className="text-center p-4 sm:p-6 max-w-md bg-white rounded-xl shadow-lg mx-4">
          <FaInfoCircle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Package Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600">
            The travel package you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile Optimized */}
      <div className="relative w-full mb-4 sm:mb-8 overflow-hidden" style={{ paddingTop: '4rem' }}>
        <div className="relative aspect-[16/10] sm:aspect-[3/1]">
          <img
            src={packageTravel.image || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21'}
            alt={packageTravel.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
            <span className="bg-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {packageTravel.tripType}
            </span>
            <span className="bg-green-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {packageTravel.travelType}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
            {packageTravel.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span className="truncate">{packageTravel.location}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-2 flex-shrink-0" />
              <span>{packageTravel.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 flex-shrink-0" />
              <span>{packageTravel.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Layout */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
        {/* Mobile Price Card - Shows at top on mobile */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Total Price</p>
                  <p className="text-2xl font-bold">₹{packageTravel.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Duration</p>
                  <p className="font-medium">{packageTravel.duration}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaUsers className="text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Group Size</p>
                  <p className="text-sm font-medium">2-12 people</p>
                </div>
              </div>
              <button 
                onClick={handleBookNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center">
                Book Now
              </button>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-700 flex items-center justify-center">
                  <FaInfoCircle className="mr-1 flex-shrink-0" />
                  <span>Free cancellation up to 30 days before departure</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Itinerary Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <FaCalendarAlt className="mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                  <span>Tour Itinerary</span>
                </h2>
                
                {packageTravel.itineraryMode === "pdf" && packageTravel.itineraryPdf ? (
                  <div className="space-y-4">
                    {/* PDF Header */}
                    <div className="flex items-center p-3 bg-red-50 rounded-lg">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="text-sm sm:text-lg font-medium text-gray-800">Itinerary PDF Document</span>
                    </div>
                    
                    {/* PDF Viewer - Responsive */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="aspect-[3/4] sm:aspect-[4/3] lg:h-[600px]">
                        <iframe 
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(packageTravel.itineraryPdf || '')}&embedded=true`}
                          className="w-full h-full"
                          title="Itinerary PDF"
                          frameBorder="0"
                          onError={(e) => {
                            const target = e.target as HTMLIFrameElement;
                            target.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(packageTravel.itineraryPdf || '')}`;
                            
                            target.addEventListener('error', () => {
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex flex-col items-center justify-center h-full bg-gray-50 p-4 sm:p-8 text-center">
                                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <h3 class="text-lg sm:text-xl font-semibold mb-2">PDF Preview Not Available</h3>
                                    <p class="text-sm sm:text-base text-gray-600 mb-4">We're having trouble displaying this PDF.</p>
                                    <a href="${packageTravel.itineraryPdf || '#'}" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
                                      View PDF in New Tab
                                    </a>
                                  </div>
                                `;
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* PDF Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button 
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                        onClick={(e) => {
                          e.preventDefault();
                          if (packageTravel.itineraryPdf) {
                            const fileName = `${packageTravel.title.replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.pdf`;
                            downloadPdf(packageTravel.itineraryPdf, fileName);
                          }
                        }}
                      >
                        <FaDownload className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>
                      <a 
                        href={packageTravel.itineraryPdf || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
                      >
                        <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Manual Itinerary - Mobile Optimized */
                  <div className="relative">
                    <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                    {packageTravel.itinerary.map((item) => (
                      <div key={item.day} className="relative pl-12 sm:pl-16 pb-6 sm:pb-8">
                        <div className="absolute left-0 flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white font-bold text-sm sm:text-base z-10">
                          {item.day}
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Day {item.day}</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">{item.details}</p>
                          {item.activities && (
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Activities:</h4>
                              <ul className="space-y-2">
                                {item.activities.map((activity, i) => (
                                  <li key={i} className="flex items-start text-sm sm:text-base">
                                    <span className="mt-1 mr-2 flex-shrink-0">
                                      {getActivityIcon(activity)}
                                    </span>
                                    <span className="leading-relaxed">{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-28">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                  <h3 className="text-lg font-bold">Book This Package</h3>
                  <p className="text-sm opacity-90">Secure your spot today</p>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{packageTravel.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-base font-medium">
                        {packageTravel.duration} 
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                        <FaUsers className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Group Size</p>
                        <p className="text-sm font-medium">2-12 people</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Book Now
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-blue-700 flex items-center justify-center">
                      <FaInfoCircle className="mr-1" />
                      Free cancellation up to 30 days before departure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <button 
          onClick={handleBookNow}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          <span className="mr-2">Book for ₹{packageTravel.price.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
};

export default PackageDetails;
