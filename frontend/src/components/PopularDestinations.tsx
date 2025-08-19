import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TravelPackage } from '../types';
import { Star } from 'lucide-react';
import { FaLongArrowAltRight } from 'react-icons/fa';

interface PopularDestinationsProps {
  packages: TravelPackage[];
}

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ packages }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle the Book Now button click
  const handleBookNow = (packageId: number) => {
    navigate(`/contact?booking=true&packageId=${packageId}`);
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Popular Trips</h2>
          <button
            onClick={() => navigate('/more-destinations')}
            className="mt-4 md:mt-0 rounded-lg px-8 py-3 bg-indigo-900 text-white hover:bg-purple-900 transition-all duration-300 flex items-center group"
          >
            <span className="font-medium">More Destinations</span>
            <FaLongArrowAltRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Travel Packages Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Destination Image */}
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
                  <Link to={`/package/${pkg.slug}`}>
                    <h3 className="text-2xl font-bold text-white mb-2 hover:text-blue-300 transition-colors">{pkg.title}</h3>
                  </Link>

                  {/* Ratings */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-1">
                      {Array.from({ length: Math.floor(pkg.rating) }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-white text-sm">({pkg.rating})</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-200 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                  {/* Price & Booking Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-bold">₹{pkg.price}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link 
                        to={`/package/${pkg.slug}`} 
                        className="rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 text-sm whitespace-nowrap"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleBookNow(pkg.id)}
                        className="rounded-lg px-3 py-2 bg-white text-gray-900 hover:bg-gray-50 transition-all duration-300 text-sm whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">No popular trips available at the moment.</p>
            <p className="text-gray-500">Please check back later or explore all our destinations.</p>
            <button
              onClick={() => navigate('/more-destinations')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              View All Destinations
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularDestinations;
