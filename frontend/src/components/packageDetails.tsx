import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  FaUsers
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
    if (lowerActivity.includes("beach")) return <FaUmbrellaBeach className="inline mr-2" />;
    if (lowerActivity.includes("food") || lowerActivity.includes("dinner")) return <FaUtensils className="inline mr-2" />;
    if (lowerActivity.includes("tour") || lowerActivity.includes("sightseeing")) return <FaCamera className="inline mr-2" />;
    if (lowerActivity.includes("transfer") || lowerActivity.includes("bus")) return <FaBus className="inline mr-2" />;
    if (lowerActivity.includes("cruise") || lowerActivity.includes("boat")) return <FaShip className="inline mr-2" />;
    return <FaChevronRight className="inline mr-2" />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ marginTop: '-80px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!packageTravel) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ marginTop: '-80px' }}>
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-lg">
          <FaInfoCircle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Package Not Found</h2>
          <p className="text-gray-600">
            The travel package you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8" style={{ paddingTop: '6rem' }}>
      {/* Hero Section - Professional and Clean */}
      <div className="relative w-full mb-12 rounded-2xl overflow-hidden aspect-[3/1]">
        <img
          src={packageTravel.image || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21'}
          alt={packageTravel.title}
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {packageTravel.tripType}
            </span>
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium">
              {packageTravel.travelType}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{packageTravel.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-base">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>{packageTravel.location}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              <span>{packageTravel.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{packageTravel.duration} </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content */}
        <div className="lg:w-2/3">
          {/* Navigation Tabs */}
          <div className="sticky top-24 z-10 mb-8 bg-white/90 backdrop-blur-sm shadow-sm rounded-xl">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                className="px-6 py-3 font-medium whitespace-nowrap transition-colors text-blue-600 border-b-2 border-blue-600"
              >
                Itinerary
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div>
            {/* Itinerary Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaCalendarAlt className="mr-3 text-blue-500" />
                  Tour Itinerary
                </h2>
                
                {packageTravel.itineraryMode === "pdf" && packageTravel.itineraryPdf ? (
                  <div className="mb-4">
                    <div className="mb-4 flex items-center">
                      <svg className="w-8 h-8 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="text-lg font-medium">Itinerary PDF Document</span>
                    </div>
                    
                    <div className="h-[600px] border border-gray-300 rounded-lg overflow-hidden">
                      <iframe 
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(packageTravel.itineraryPdf || '')}&embedded=true`}
                        className="w-full h-full"
                        title="Itinerary PDF"
                        frameBorder="0"
                        onError={(e) => {
                          // If Google Docs viewer fails, try PDF.js viewer as fallback
                          const target = e.target as HTMLIFrameElement;
                          target.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(packageTravel.itineraryPdf || '')}`;
                          
                          // Add second error handler
                          target.addEventListener('error', () => {
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center h-full bg-gray-50 p-8 text-center">
                                  <svg class="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                  </svg>
                                  <h3 class="text-xl font-semibold mb-2">PDF Preview Not Available</h3>
                                  <p class="text-gray-600 mb-4">We're having trouble displaying this PDF.</p>
                                  <a href="${packageTravel.itineraryPdf || '#'}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                    View PDF in New Tab
                                  </a>
                                </div>
                              `;
                            }
                          });
                        }}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href={packageTravel.itineraryPdf || '#'} 
                          download
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            if (packageTravel.itineraryPdf) {
                              const fileName = `${packageTravel.title.replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.pdf`;
                              const pdfUrl = packageTravel.itineraryPdf; // Create a typed local variable
                              downloadPdf(pdfUrl, fileName);
                            }
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                          Save Itinerary PDF
                        </a>

                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                    {packageTravel.itinerary.map((item) => (
                      <div key={item.day} className="relative pl-16 pb-8">
                        <div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold z-10">
                          {item.day}
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Day {item.day}</h3>
                          <p className="text-gray-600 mb-3">{item.details}</p>
                          {item.activities && (
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-700 mb-1">Activities:</h4>
                              <ul className="space-y-1">
                                {item.activities.map((activity, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-blue-500 mt-1 mr-2">
                                      {getActivityIcon(activity)}
                                    </span>
                                    <span>{activity}</span>
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
        </div>

        {/* Right Sidebar - Booking Card */}
        <div className="lg:w-1/3">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-blue-600 p-5 text-white">
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

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
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
  );
};

export default PackageDetails;