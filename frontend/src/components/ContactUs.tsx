import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

interface TravelPackage {
    _id: string;
    id?: number;  // Add optional id property for packages that use numeric IDs
    title: string;
    location: string;
    price: number;
}

const ContactUs = () => {
    // Get user authentication state from Clerk
    const { isLoaded, isSignedIn, user } = useUser();
    const location = useLocation();
    
    // State for active tab
    const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'booking'
    
    // Contact form state
    const [contactForm, setContactForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: ""
    });
    
    // Booking form state
    const [bookingForm, setBookingForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        numberOfPeople: "",
        tourPackage: "",
        tourPackageName: "",
        bookingDate: "",
        message: ""
    });
    
    const [travelPackages, setTravelPackages] = useState<TravelPackage[]>([]);
    const [isLoadingPackages, setIsLoadingPackages] = useState(false);

    // Handle contact form changes
    const handleContactChange = (e: any) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    // Handle booking form changes
    const handleBookingChange = (e: any) => {
        setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
    };

    const [isSubmittingContact, setIsSubmittingContact] = useState(false);
    const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

    // Check URL parameters for redirect to booking tab
    useEffect(() => {
        // Check if we should redirect to booking tab
        const params = new URLSearchParams(location.search);
        if (params.get('booking') === 'true') {
            setActiveTab('booking');
        }
    }, [location]);

    // Pre-fill user data when logged in
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            // Pre-fill booking form with user data
            setBookingForm(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                phone: user.phoneNumbers?.[0]?.phoneNumber || ''
            }));
            
            // Also pre-fill contact form
            setContactForm(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                phone: user.phoneNumbers?.[0]?.phoneNumber || ''
            }));
        }
    }, [isLoaded, isSignedIn, user]);

    // Fetch available travel packages
    useEffect(() => {
        const fetchTravelPackages = async () => {
            setIsLoadingPackages(true);
            try {
                const response = await axios.get(getApiUrl('/api/travelPackages'));
                console.log('Travel packages response:', response.data);
                
                let packagesData = [];
                
                if (response.data && response.data.data) {
                    packagesData = response.data.data;
                    console.log('Loaded packages from data field:', packagesData.length);
                } else if (Array.isArray(response.data)) {
                    packagesData = response.data;
                    console.log('Loaded packages from direct array:', packagesData.length);
                } else {
                    console.warn('Unexpected API response format:', response.data);
                }
                
                setTravelPackages(packagesData);
                
                // Check if we need to select a package from URL params
                const params = new URLSearchParams(location.search);
                const packageId = params.get('packageId');
                
                if (packageId && packagesData.length > 0) {
                    // Convert packageId to string for comparison if needed
                    const packageIdStr = String(packageId);
                    
                    // Find the package by comparing IDs as strings to handle both number and string IDs
                    const selectedPackage = packagesData.find((pkg: TravelPackage) => 
                        String(pkg._id) === packageIdStr || String(pkg.id) === packageIdStr
                    );
                    
                    if (selectedPackage) {
                        console.log('Auto-selecting package from URL params:', selectedPackage.title);
                        setBookingForm(prev => ({
                            ...prev,
                            tourPackage: selectedPackage._id || String(selectedPackage.id),
                            tourPackageName: selectedPackage.title
                        }));
                        setActiveTab('booking');
                    } else {
                        console.warn(`Package with ID ${packageId} not found in loaded packages`);
                    }
                }
            } catch (error) {
                console.error('Error fetching travel packages:', error);
            } finally {
                setIsLoadingPackages(false);
            }
        };
        
        fetchTravelPackages();
    }, [location.search]);

    // Handle package selection for booking form
    const handlePackageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedPackage = travelPackages.find(pkg => 
            pkg._id === selectedId || String(pkg.id) === selectedId
        );
        
        setBookingForm({
            ...bookingForm,
            tourPackage: selectedId,
            tourPackageName: selectedPackage ? selectedPackage.title : ''
        });
    };

    const sendContactForm = async (e: any) => {
        e.preventDefault();
        setIsSubmittingContact(true);

        try {
            // Send contact form data to backend API
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/contacts`,
                contactForm
            );
            
            // Reset form on success
            setContactForm({ 
                fullName: "", 
                email: "", 
                phone: "", 
                message: ""
            });
            alert("Message sent successfully!");
        } catch (error) {
            console.error("Error sending contact form:", error);
            alert("Failed to send message. Please try again later.");
        } finally {
            setIsSubmittingContact(false);
        }
    };

    const handleBookNow = async (e: any) => {
        e.preventDefault();
        
        if (!bookingForm.tourPackage) {
            alert("Please select a tour package to book");
            return;
        }

        if (!bookingForm.bookingDate) {
            alert("Please select a booking date");
            return;
        }

        if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone || !bookingForm.numberOfPeople) {
            alert("Please fill in all required fields (name, email, phone, and number of people)");
            return;
        }

        setIsSubmittingBooking(true);

        try {
            // Send booking data to backend API
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/bookings`,
                {
                    tourId: bookingForm.tourPackage,
                    bookingDate: bookingForm.bookingDate,
                    numberOfPeople: parseInt(bookingForm.numberOfPeople),
                    specialRequirements: bookingForm.message,
                    fullName: bookingForm.fullName,
                    email: bookingForm.email,
                    phone: bookingForm.phone
                }
            );
            
            // Reset form on success
            setBookingForm({ 
                fullName: "", 
                email: "", 
                phone: "", 
                message: "", 
                numberOfPeople: "", 
                tourPackage: "",
                tourPackageName: "",
                bookingDate: ""
            });
            
            alert("Booking created successfully! Your booking is pending confirmation.");
        } catch (error: any) {
            console.error("Error creating booking:", error);
            alert(error.response?.data?.message || "Failed to create booking. Please try again later.");
        } finally {
            setIsSubmittingBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white text-gray-900">
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800">Contact & Booking</h1>
                    
                    {/* User status indicator */}
                    {isLoaded && isSignedIn && (
                        <div className="text-center mb-4">
                            <p className="text-green-600 font-medium">Logged in as {user?.fullName || user?.username}</p>
                        </div>
                    )}
                    
                    {/* Tabs for switching between forms */}
                    <div className="flex justify-center mb-10">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button
                                type="button"
                                onClick={() => setActiveTab('contact')}
                                className={`px-6 py-3 text-sm font-medium ${activeTab === 'contact' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-blue-700 bg-white hover:bg-blue-50'} 
                                    border border-blue-300 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500`}
                            >
                                Contact Us
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('booking')}
                                className={`px-6 py-3 text-sm font-medium ${activeTab === 'booking' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-blue-700 bg-white hover:bg-blue-50'} 
                                    border border-blue-300 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500`}
                            >
                                Book a Tour
                            </button>
                        </div>
                    </div>
                    
                    {/* Contact Form Section */}
                    {activeTab === 'contact' && (
                        <div id="contactForm" className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center">Get in Touch</h2>
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                                    <form className="space-y-6" onSubmit={sendContactForm}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={contactForm.fullName}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={contactForm.email}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={contactForm.phone}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                            <textarea
                                                rows={4}
                                                name="message"
                                                value={contactForm.message}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Type your message here..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingContact}
                                            className={`rounded-lg w-full py-3 ${isSubmittingContact ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold transition-all duration-300 shadow-lg`}
                                        >
                                            {isSubmittingContact ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                                <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-2 text-blue-800">Our Location</h3>
                                    <p className="text-gray-600">Plot No 830, N-5, Rahul Palace, Oppo Shiva Pickup, Cannought Garden Road, CIDCO Colony, Chhatrapati Sambhaji Nagar (431003), Maharashtra, India</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Booking Form Section */}
                    {activeTab === 'booking' && (
                        <div id="bookingForm" className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center">Book Your Tour</h2>
                            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                                <form className="space-y-6" onSubmit={handleBookNow}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={bookingForm.fullName}
                                                onChange={handleBookingChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={bookingForm.email}
                                                onChange={handleBookingChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={bookingForm.phone}
                                                onChange={handleBookingChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                                            <input
                                                type="number"
                                                name="numberOfPeople"
                                                value={bookingForm.numberOfPeople}
                                                onChange={handleBookingChange}
                                                required
                                                min="1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="How many people will be traveling?"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Tour Package</label>
                                        <select
                                            name="tourPackage"
                                            value={bookingForm.tourPackage}
                                            onChange={handlePackageSelect}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isLoadingPackages}
                                        >
                                            <option value="">Select a tour package</option>
                                            {isLoadingPackages ? (
                                                <option disabled>Loading packages...</option>
                                            ) : travelPackages.length > 0 ? (
                                                travelPackages.map((pkg) => (
                                                    <option key={pkg._id} value={pkg._id}>
                                                        {pkg.title} - {pkg.location} (₹{pkg.price})
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No packages available</option>
                                            )}
                                        </select>
                                        {isLoadingPackages && (
                                            <div className="mt-2 text-sm text-blue-600 flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Loading packages...
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                                        <input
                                            type="date"
                                            name="bookingDate"
                                            value={bookingForm.bookingDate}
                                            onChange={handleBookingChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                                        <textarea
                                            rows={4}
                                            name="message"
                                            value={bookingForm.message}
                                            onChange={handleBookingChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Any special requirements or requests..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingBooking}
                                        className={`rounded-lg w-full py-3 ${isSubmittingBooking ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold transition-all duration-300 shadow-lg`}
                                    >
                                        {isSubmittingBooking ? 'Processing...' : 'Book Now'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
