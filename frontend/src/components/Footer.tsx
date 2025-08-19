import React from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { BiLogoWhatsapp } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle FAQ link click
  const handleFAQClick = () => {
    // If we're already on the home page, scroll to the FAQs section
    if (location.pathname === '/') {
      const faqsSection = document.getElementById("faqs-section");
      if (faqsSection) {
        faqsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to home page with a hash for FAQs
      navigate('/?scrollToFAQ=true');
    }
  };

  return (
    <footer id="footer" className="bg-gray-900 text-white py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">Elite Holidays</h3>
            <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">
              Making your travel dreams come true with luxury experiences and unforgettable adventures.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {[
                { Icon: FaYoutube, color: "hover:text-red-500", link: "https://youtube.com" },
                { Icon: IoLogoInstagram, color: "hover:text-pink-400", link: "https://instagram.com" },
                { Icon: BiLogoWhatsapp, color: "hover:text-green-500", link: "https://wa.me/yourwhatsapp" },
                { Icon: FaFacebook, color: "hover:text-blue-400", link: "https://facebook.com" }
              ].map(({ Icon, color, link }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${color} transition-colors duration-300`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Quick Links</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/more-destinations" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Support</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={handleFAQClick}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base"
                >
                  FAQs
                </button>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Contact Info</h4>
            <p className="text-gray-400 text-sm md:text-base mb-2 md:mb-4">Get in touch with us for any inquiries or assistance.</p>
            <div className="space-y-1 md:space-y-2">
              <p className="text-gray-400 text-sm md:text-base">
                <span className="font-semibold text-white">Email:</span> eliteholidays3@gmail.com
              </p>
              <p className="text-gray-400 text-sm md:text-base">
                <span className="font-semibold text-white">Phone:</span> +91 95950 14141
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Contact Section */}
        <div className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-gray-800 text-center text-gray-400">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} Elite Holidays. All rights reserved.</p>
          <p className="mt-1 md:mt-2 text-sm md:text-base">Developed by <span className="font-semibold text-white">Giganxt Solutions</span></p>
          <p className="mt-1 text-sm md:text-base">Contact us: <a href="mailto:contact@giganxt.com" className="text-blue-400 hover:underline">contact@giganxt.me</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
