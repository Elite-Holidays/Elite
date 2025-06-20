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
    <footer id="footer" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Elite Holidays</h3>
            <p className="text-gray-400 mb-4">
              Making your travel dreams come true with luxury experiences and unforgettable adventures.
            </p>
            <div className="flex space-x-4">
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
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/more-destinations" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={handleFAQClick}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  FAQs
                </button>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-400 mb-4">Get in touch with us for any inquiries or assistance.</p>
            <div className="space-y-2">
              <p className="text-gray-400">
                <span className="font-semibold text-white">Email:</span> eliteholidays3@gmail.com
              </p>
              <p className="text-gray-400">
                <span className="font-semibold text-white">Phone:</span> +91 95950 14141
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Contact Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Elite Holidays. All rights reserved.</p>
          <p className="mt-2">Developed by <span className="font-semibold text-white">Giganxt Solutions</span></p>
          <p className="mt-1">Contact us: <a href="mailto:contact@giganxt.com" className="text-blue-400 hover:underline">contact@giganxt.me</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
