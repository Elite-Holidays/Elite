import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { getApiUrl } from "../../utils/apiConfig";

interface Booking {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  bookingDate: string;
  numberOfPeople: number;
  specialRequirements?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  tour: {
    _id: string;
    title: string;
    price: number;
    location: string;
    images?: string[];
  };
}

const UserBookings: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const email = encodeURIComponent(user.primaryEmailAddress?.emailAddress || '');
        const response = await axios.get(getApiUrl(`/api/bookings/user/${email}`));
        
        if (response.data.status === "success") {
          setBookings(response.data.data);
        } else {
          setError("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("An error occurred while fetching your bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [isLoaded, user]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="text-center text-red-500 py-4">{error}</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="text-center text-gray-500 py-4">
          You don't have any bookings yet. 
          <a href="/contact?booking=true" className="text-blue-500 ml-2 hover:underline">
            Book a tour now!
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Bookings</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour Package
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  People
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {booking.tour?.images && booking.tour.images.length > 0 && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={booking.tour.images[0]} 
                            alt={booking.tour.title} 
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.tour?.title || "N/A"}</div>
                        <div className="text-sm text-gray-500">{booking.tour?.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.numberOfPeople}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Status Information</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-300 mr-2"></span>
            <span><strong>Pending:</strong> Your booking is being reviewed by our team</span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span><strong>Confirmed:</strong> Your booking has been confirmed</span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span><strong>Cancelled:</strong> This booking has been cancelled</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserBookings;
