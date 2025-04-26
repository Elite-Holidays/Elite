import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { useUser } from "@clerk/clerk-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  phoneNumbers: { phoneNumber: string }[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/");
        const data = await response.json();
  
        if (data?.users && Array.isArray(data.users)) {
          const filteredUsers = data.users.filter(
            (user: any) => user.publicMetadata?.role?.toLowerCase() !== "admin"
          );
          setUsers(filteredUsers);
        } else {
          throw new Error("Invalid API response: No users found");
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [isAdmin]);
  
  if (!isAdmin) {
    return null;
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User Data", 20, 10);
    let yPos = 20;

    users.forEach((user, index) => {
      doc.text(
        `${index + 1}. ${user.firstName} ${user.lastName} - ${
          user.emailAddresses?.[0]?.emailAddress || "N/A"
        } - ${user.phoneNumbers?.[0]?.phoneNumber || "N/A"}`,
        10,
        yPos
      );
      yPos += 10;
    });

    doc.save("users.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        ID: user.id,
        "First Name": user.firstName || "N/A",
        "Last Name": user.lastName || "N/A",
        Email: user.emailAddresses?.[0]?.emailAddress || "N/A",
        Phone: user.phoneNumbers?.[0]?.phoneNumber || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your travel platform</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
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

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => navigate("/admin/create-slides")} 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-blue-600 text-xl">➕</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Add Hero Slide</h3>
                <p className="text-sm text-gray-500">Create new slides</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate("/admin/create-package")} 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-green-600 text-xl">🌍</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Add Travel Package</h3>
                <p className="text-sm text-gray-500">Create new packages</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate("/admin/slides")} 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <span className="text-purple-600 text-xl">📽️</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">View Slides</h3>
                <p className="text-sm text-gray-500">Manage existing slides</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate("/admin/packages")} 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg mr-4">
                <span className="text-amber-600 text-xl">🌍</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">View Packages</h3>
                <p className="text-sm text-gray-500">Manage travel packages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Registered Users</h3>
            <p className="text-sm text-gray-500 mt-1">All non-admin users in the system</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-red-600">{error}</p>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.firstName || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastName || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.emailAddresses?.[0]?.emailAddress || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phoneNumbers?.[0]?.phoneNumber || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;