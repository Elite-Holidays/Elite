import React from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { BiLogoWhatsapp } from "react-icons/bi";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
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
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Blog
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
                  onClick={() => {
                    const faqsSection = document.getElementById("faqs-section");
                    if (faqsSection) {
                      faqsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
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

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and travel updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none text-gray-900 placeholder-gray-500"
              />
              <button className="rounded-r-lg whitespace-nowrap px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Contact Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Elite Holidays. All rights reserved.</p>
          <p className="mt-2">Developed by <span className="font-semibold text-white">GIGANXT Solutions</span></p>
          <p className="mt-1">Contact us: <a href="mailto:contact@giganxt.me" className="text-blue-400 hover:underline">contact@giganxt.me</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
