import React from 'react';
import { Feature } from '../types';
import { FaGem, FaShieldAlt, FaHandHoldingHeart } from "react-icons/fa";




interface WhyChooseUsProps {
  features: Feature[];
}

const iconMap = {
  gem: FaGem,
  shield: FaShieldAlt,
  heart: FaHandHoldingHeart,
};
const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ features }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose Elite Holidays</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;