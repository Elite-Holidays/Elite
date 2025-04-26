import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaInfoCircle,
  FaChevronRight,
  FaUmbrellaBeach,
  FaUtensils,
  FaCamera,
  FaBus,
  FaShip,
  FaUser
} from "react-icons/fa";

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
  itinerary: { day: number; details: string; activities?: string[] }[];
  flights: {
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  }[];
  accommodations: {
    hotel: string;
    city: string;
    country: string;
    checkIn: string;
    checkOut: string;
    amenities?: string[];
    image?: string;
  }[];
  reporting?: {
    guestType: string;
    reportingPoint: string;
    droppingPoint: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageTravel, setPackageTravel] = useState<PackageDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("itinerary");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/travelPackages/${id}`);
        if (!response.ok) throw new Error("Failed to fetch package");
        const data = await response.json();
        setPackageTravel(data);
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const getActivityIcon = (activity: string) => {
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes("beach")) return <FaUmbrellaBeach className="inline mr-2" />;
    if (lowerActivity.includes("food") || lowerActivity.includes("dinner")) return <FaUtensils className="inline mr-2" />;
    if (lowerActivity.includes("tour") || lowerActivity.includes("sightseeing")) return <FaCamera className="inline mr-2" />;
    if (lowerActivity.includes("transfer") || lowerActivity.includes("bus")) return <FaBus className="inline mr-2" />;
    if (lowerActivity.includes("cruise") || lowerActivity.includes("boat")) return <FaShip className="inline mr-2" />;
    return <FaChevronRight className="inline mr-2" />;
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
              <span>{packageTravel.duration} days</span>
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
              {["itinerary", "flights", "accommodations", "reporting"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? "text-blue-600 border-b-2 border-blue-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div>
            {/* Itinerary Section */}
            {activeTab === "itinerary" && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaCalendarAlt className="mr-3 text-blue-500" />
                    Tour Itinerary
                  </h2>
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
                </div>
              </div>
            )}

            {/* Flights Section */}
            {activeTab === "flights" && packageTravel.flights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaPlane className="mr-3 text-blue-500" />
                    Flight Details
                  </h2>
                  <div className="space-y-4">
                    {packageTravel.flights.map((flight, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <FaPlane className="text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold">Flight {index + 1}</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">From</p>
                            <p className="font-medium">{flight.from}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">To</p>
                            <p className="font-medium">{flight.to}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="font-medium">{flight.duration}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Departure</p>
                            <p className="font-medium flex items-center">
                              <FaClock className="mr-2 text-blue-500" />
                              {flight.departureTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Arrival</p>
                            <p className="font-medium flex items-center">
                              <FaClock className="mr-2 text-blue-500" />
                              {flight.arrivalTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Accommodations Section */}
            {activeTab === "accommodations" && packageTravel.accommodations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaHotel className="mr-3 text-blue-500" />
                    Accommodations
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {packageTravel.accommodations.map((stay, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                          <img
                            src={stay.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                            alt={stay.hotel}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-1">{stay.hotel}</h3>
                          <p className="text-gray-600 text-sm mb-2 flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-blue-500" />
                            {stay.city}, {stay.country}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">Check-in</p>
                              <p className="font-medium flex items-center">
                                <FaCalendarAlt className="mr-1 text-blue-500" />
                                {stay.checkIn}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="font-medium flex items-center">
                                <FaCalendarAlt className="mr-1 text-blue-500" />
                                {stay.checkOut}
                              </p>
                            </div>
                          </div>
                          {stay.amenities && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                              <div className="flex flex-wrap gap-1">
                                {stay.amenities.slice(0, 3).map((amenity, i) => (
                                  <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                                    {amenity}
                                  </span>
                                ))}
                                {stay.amenities.length > 3 && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    +{stay.amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reporting Section */}
            {activeTab === "reporting" && packageTravel.reporting && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Reporting Details</h2>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Guest Type</h3>
                        <p className="text-gray-600">{packageTravel.reporting.guestType}</p>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Reporting Point</h3>
                        <p className="text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-blue-500" />
                          {packageTravel.reporting.reportingPoint}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Dropping Point</h3>
                        <p className="text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-blue-500" />
                          {packageTravel.reporting.droppingPoint}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                      {packageTravel.duration} days
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <FaCalendarAlt className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Available</p>
                      <p className="text-sm font-medium">June 15, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <FaUser className="text-blue-600 text-sm" />
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

            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
              <h3 className="text-lg font-bold mb-3">Trip Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Private guided tours</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  <span>All entrance fees included</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Daily breakfast included</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Travel insurance options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;