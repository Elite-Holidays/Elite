import React, { useState, useRef, useEffect } from "react";
import { getApiUrl } from "./utils/apiConfig";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PopularDestinations from "./components/PopularDestinations";
import MoreDestinations from "./components/MoreDestinations";
import Groups from "./components/Groups";
import WhyChooseUs from "./components/WhyChooseUs";
import Statistics from "./components/Statistics";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import SocialLinks from "./components/SocialLinks";
import About from "./components/About";
import PrivacyPolicy from "./components/PrivacyPolicy";
import FAQs from "./components/FAQs";
import TAC from "./components/TAC";
import Blog from "./components/Blog";
import OvalCards from "./components/OvalCards";
import ContactUs from "./components/ContactUs.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";
import RegisterPage from "./components/auth/RegisterPage.tsx";
import DashboardUser from "./components/UserDashboard/dashboardUser.tsx";
import AdminDashboard from "./components/UserDashboard/adminDashboard.tsx";
import ShowSlides from "./components/UserDashboard/showSlides.tsx";
import ShowPackages from "./components/UserDashboard/showPackages.tsx";
import AdminBookings from "./components/UserDashboard/AdminBookings.tsx";
import AdminContacts from "./components/UserDashboard/AdminContacts.tsx";
import { heroSlides, travelPackages, reviews, features, statistics } from "./data";
import ScrollToTop from "./components/ScrollToTop";
import CreatePackage from "./components/UserDashboard/createPackage.tsx";
import CreateSlides from "./components/UserDashboard/createSlides.tsx";
import Honeymoon from "./components/Honeymoon.tsx";
import FamilyTrip from "./components/FamilyTrip.tsx";
import SoloTrip from "./components/SoloTrip.tsx";
import PackageDetails from "./components/packageDetails.tsx";
import ApiDebug from "./components/UserDashboard/ApiDebug.tsx";
import EditSlide from "./components/UserDashboard/editSlide.tsx";
import EditPackage from "./components/UserDashboard/editPackage.tsx";
import AuthGuard from "./components/AuthGuard.tsx";
import Notification from "./components/Notification";
import { TravelPackage } from "./types";

// Wrapper component to access location in the Routes
const AppContent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [apiSlides, setApiSlides] = useState([]);
  const [popularPackages, setPopularPackages] = useState<TravelPackage[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const popularTripsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info"
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Show notification if redirected with error message
  useEffect(() => {
    if (location.state && (location.state as any).error) {
      setNotification({
        visible: true,
        message: (location.state as any).error,
        type: "error"
      });
      
      // Clear the error from location state to prevent it from showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false
    }));
  };

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setSlidesLoading(true);
        const response = await fetch(getApiUrl('/api/heroslides'));
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data = await response.json();
        setApiSlides(data);
      } catch (error) {
        console.error("Error fetching slides:", error);
        // Fallback to hardcoded slides in case of error
      } finally {
        setSlidesLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Fetch popular packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);
        const response = await fetch(getApiUrl('/api/travelpackages'));
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        
        // Filter packages marked as popular
        const popular = data.filter((pkg: any) => pkg.isPopular === true);
        setPopularPackages(popular.length > 0 ? popular : travelPackages); // Fallback to hardcoded packages if none marked as popular
      } catch (error) {
        console.error("Error fetching packages:", error);
        // Fallback to hardcoded packages in case of error
        setPopularPackages(travelPackages);
      } finally {
        setPackagesLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Effect to handle scrolling when navigating from other pages
  useEffect(() => {
    // Check if we have state with scrollToPopularTrips flag
    if (location.state && (location.state as any).scrollToPopularTrips) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        if (popularTripsRef.current) {
          popularTripsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }

    // Check for FAQ scroll parameter in URL
    const params = new URLSearchParams(location.search);
    if (params.get('scrollToFAQ') === 'true') {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        const faqsSection = document.getElementById("faqs-section");
        if (faqsSection) {
          faqsSection.scrollIntoView({ behavior: "smooth" });
          // Clear the URL parameter without refreshing the page
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 500);
    }
  }, [location]);

  const scrollToPopularTrips = () => {
    if (popularTripsRef.current) {
      popularTripsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ScrollToTop />
      <Header scrollToPopularTrips={scrollToPopularTrips} />
      
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          visible={notification.visible}
          onClose={handleCloseNotification}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection 
                // Use API slides if available, otherwise fall back to hardcoded ones
                slides={apiSlides.length > 0 ? apiSlides : heroSlides} 
                isVisible={isVisible} 
              />
              <OvalCards />
              <WhyChooseUs features={features} />
              <div ref={popularTripsRef}>
                <PopularDestinations packages={popularPackages} />
              </div>
              <Statistics stats={statistics} />
              <Reviews />
              <FAQs />
            </>
          }
        />
        <Route path="/more-destinations" element={<MoreDestinations />} />
        <Route path="/group" element={<Groups />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/package/:slug" element={<PackageDetails />} />
        <Route path ="/honeymoon" element ={<Honeymoon/>}/>
        <Route path="/familytrip" element={<FamilyTrip/>}/>
        <Route path="/solotrip" element={<SoloTrip/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/terms" element={<TAC />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* User routes - requires authentication */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <DashboardUser />
          </AuthGuard>
        } />
        
        {/* Admin routes - requires authentication and admin role */}
        <Route path="/admin" element={
          <AuthGuard adminOnly>
            <AdminDashboard />
          </AuthGuard>
        } />
        <Route path="/admin/slides" element={
          <AuthGuard adminOnly>
            <ShowSlides/>
          </AuthGuard>
        } />
        <Route path="/admin/packages" element={
          <AuthGuard adminOnly>
            <ShowPackages/>
          </AuthGuard>
        } />
        <Route path="/admin/create-package" element={
          <AuthGuard adminOnly>
            <CreatePackage />
          </AuthGuard>
        } />
        <Route path="/admin/create-slides" element={
          <AuthGuard adminOnly>
            <CreateSlides />
          </AuthGuard>
        } />
        <Route path="/admin/api-debug" element={
          <AuthGuard adminOnly>
            <ApiDebug />
          </AuthGuard>
        } />
        <Route path="/admin/edit-slide/:slideId" element={
          <AuthGuard adminOnly>
            <EditSlide />
          </AuthGuard>
        } />
        <Route path="/admin/edit-package/:packageId" element={
          <AuthGuard adminOnly>
            <EditPackage />
          </AuthGuard>
        } />
        <Route path="/admin/bookings" element={
          <AuthGuard adminOnly>
            <AdminBookings />
          </AuthGuard>
        } />
        <Route path="/admin/contacts" element={
          <AuthGuard adminOnly>
            <AdminContacts />
          </AuthGuard>
        } />
      </Routes>

      <Footer />
      <Chatbot />
      <SocialLinks />
    </div>
  );
};

// Main App component with Router
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
