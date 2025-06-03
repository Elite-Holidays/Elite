import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getApiUrl } from "../../utils/apiConfig";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

const AdminContacts: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: "/admin/contacts" } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  // Fetch contacts
  useEffect(() => {
    if (!isAdmin) return;

    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl("/api/contacts"));
        
        if (response.data && Array.isArray(response.data.data)) {
          setContacts(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setContacts(response.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: any) {
        console.error("Error fetching contacts:", err);
        setError(err.message || "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [isAdmin]);

  // Delete contact
  const deleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;
    
    try {
      await axios.delete(getApiUrl(`/api/contacts/${contactId}`));
      setContacts(contacts.filter(contact => contact._id !== contactId));
      
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Failed to delete contact");
    }
  };

  // View contact details
  const viewContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  // Export functions
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Contact Messages Report", 20, 10);
    
    // Add headers
    doc.setFontSize(10);
    doc.text("Name", 10, 20);
    doc.text("Email", 60, 20);
    doc.text("Phone", 130, 20);
    doc.text("Date", 170, 20);
    
    let yPos = 30;
    
    contacts.forEach((contact) => {
      const contactDate = new Date(contact.createdAt).toLocaleDateString();
      
      doc.text(contact.fullName.substring(0, 25), 10, yPos);
      doc.text(contact.email.substring(0, 35), 60, yPos);
      doc.text(contact.phone || "N/A", 130, yPos);
      doc.text(contactDate, 170, yPos);
      
      yPos += 10;
      
      // Add message with word wrap
      const messageLines = doc.splitTextToSize(contact.message, 180);
      doc.text(messageLines, 10, yPos);
      
      yPos += messageLines.length * 7 + 10;
      
      // Add a separator line
      doc.line(10, yPos - 5, 200, yPos - 5);
      
      // Add a new page if we're running out of space
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save("contact-messages.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      contacts.map(contact => ({
        ID: contact._id,
        Name: contact.fullName,
        Email: contact.email,
        Phone: contact.phone || "N/A",
        Message: contact.message,
        "Created At": new Date(contact.createdAt).toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, "contact-messages.xlsx");
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
            <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
            <p className="text-gray-600 mt-2">View and manage customer inquiries</p>
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

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Customer Messages</h3>
            <p className="text-sm text-gray-500 mt-1">All messages from the contact form</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No contact messages found</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{contact.fullName}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone || "No phone provided"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {contact.message.length > 100 
                            ? `${contact.message.substring(0, 100)}...` 
                            : contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(contact.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewContactDetails(contact)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteContact(contact._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
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

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Contact Message Details</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">From</h4>
                <p className="text-base font-medium">{selectedContact.fullName}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
                <p className="text-base">Email: {selectedContact.email}</p>
                <p className="text-base">Phone: {selectedContact.phone || "Not provided"}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                <p className="text-base">{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => deleteContact(selectedContact._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
