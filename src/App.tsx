import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { heroSlides, travelPackages, reviews, features, statistics } from "./data";
import ScrollToTop from "./components/ScrollToTop";
import CreatePackage from "./components/UserDashboard/createPackage.tsx";
import CreateSlides from "./components/UserDashboard/createSlides.tsx";
import Honeymoon from "./components/Honeymoon.tsx";
import FamilyTrip from "./components/FamilyTrip.tsx";
import SoloTrip from "./components/SoloTrip.tsx";
import PackageDetails from "./components/packageDetails.tsx";

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const popularTripsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToPopularTrips = () => {
    if (popularTripsRef.current) {
      popularTripsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Header scrollToPopularTrips={scrollToPopularTrips} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection slides={heroSlides} isVisible={isVisible} />
                <OvalCards />
                <WhyChooseUs features={features} />
                <div ref={popularTripsRef}>
                  <PopularDestinations packages={travelPackages} />
                </div>
                <Statistics stats={statistics} />
                <Reviews reviews={reviews} />
                <FAQs />
              </>
            }
          />
          <Route path="/more-destinations" element={<MoreDestinations />} />
          <Route path="/group" element={<Groups />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
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
          <Route path="/dashboard" element={<DashboardUser />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/slides" element={<ShowSlides/>}/>
          <Route path="/admin/packages" element={<ShowPackages/>}/>
          <Route path="/admin/create-package" element={<CreatePackage />} />
          <Route path="/admin/create-slides" element={<CreateSlides />} /> 


        </Routes>

        <Footer />
        <Chatbot />
        <SocialLinks />
      </div>
    </Router>
  );
};

export default App;
