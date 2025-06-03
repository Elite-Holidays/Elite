import React from 'react';
import { FaYoutube, FaFacebook } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io';
import { BiLogoWhatsapp } from 'react-icons/bi';

const SocialLinks: React.FC = () => {
  return (
    <>
      <div className="fixed bottom-8 left-8 flex flex-col space-y-4 z-40">
        {[
          { Icon: FaYoutube, color: 'hover:text-red-600' },
          { Icon: IoLogoInstagram, color: 'hover:text-pink-600' },
          { Icon: BiLogoWhatsapp, color: 'hover:text-green-600' },
          { Icon: FaFacebook, color: 'hover:text-blue-600' }
        ].map(({ Icon, color }, index) => (
          <a
            key={index}
            href="#"
            className={`w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white ${color} transform hover:scale-110 transition-all duration-300 hover:shadow-lg`}
            style={{ animation: `bounce 1s ease-in-out ${index * 0.1}s infinite` }}
          >
            <Icon className="w-5 h-5" />
          </a>
        ))}
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            70% { transform: translateY(-5px); }
          }
        `}
      </style>
    </>
  );
};

export default SocialLinks;
