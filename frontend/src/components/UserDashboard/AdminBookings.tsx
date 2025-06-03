import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getApiUrl } from "../../utils/apiConfig";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

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
  };
}

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: "/admin/bookings" } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  // Fetch bookings
  useEffect(() => {
    if (!isAdmin) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl("/api/bookings"));
        
        if (response.data && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAdmin]);

  // Filter bookings based on status
  const filteredBookings = statusFilter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await axios.patch(getApiUrl(`/api/bookings/${bookingId}`), {
        status: newStatus
      });
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus as "pending" | "confirmed" | "cancelled" } 
            : booking
        )
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update booking status");
    }
  };

  // Export functions
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Bookings Report", 20, 10);
    
    // Add headers
    doc.setFontSize(10);
    doc.text("Name", 10, 20);
    doc.text("Package", 60, 20);
    doc.text("Date", 110, 20);
    doc.text("Status", 150, 20);
    doc.text("People", 180, 20);
    
    let yPos = 30;
    
    filteredBookings.forEach((booking) => {
      const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
      
      doc.text(booking.fullName.substring(0, 25), 10, yPos);
      doc.text(booking.tour?.title?.substring(0, 25) || "N/A", 60, yPos);
      doc.text(bookingDate, 110, yPos);
      doc.text(booking.status, 150, yPos);
      doc.text(booking.numberOfPeople.toString(), 180, yPos);
      
      yPos += 10;
      
      // Add a new page if we're running out of space
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save("bookings-report.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredBookings.map(booking => ({
        ID: booking._id,
        Name: booking.fullName,
        Email: booking.email,
        Phone: booking.phone,
        Package: booking.tour?.title || "N/A",
        "Booking Date": new Date(booking.bookingDate).toLocaleDateString(),
        "Number of People": booking.numberOfPeople,
        "Special Requirements": booking.specialRequirements || "None",
        Status: booking.status,
        "Created At": new Date(booking.createdAt).toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "bookings-report.xlsx");
  };

  // Early return for non-admin or loading state
  if (!isLoaded || !isSignedIn || !isAdmin) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
            <p className="text-gray-600 mt-2">View and manage all tour bookings</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="mr-2">←</span> Back to Dashboard
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="mr-2">📄</span> Export PDF
            </button>
            <button
              onClick={downloadExcel}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="mr-2">📊</span> Export Excel
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredBookings.length}</span> bookings
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Tour Bookings</h3>
            <p className="text-sm text-gray-500 mt-1">All booking requests from customers</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No bookings found</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                          <div className="text-sm text-gray-500">{booking.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.tour?.title || "N/A"}</div>
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status === 'cancelled' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
