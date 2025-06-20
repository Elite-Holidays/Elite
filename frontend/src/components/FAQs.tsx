import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQs: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What is included in your luxury packages?",
            answer:
                "Our luxury packages include 5-star accommodation, private transfers, exclusive experiences, 24/7 concierge service, and personalized itineraries. Some packages also include meals, activities, and local guides.",
        },
        {
            question: "How far in advance should I book my trip?",
            answer:
                "We recommend booking at least 3-6 months in advance for peak seasons and special experiences. However, we can also accommodate last-minute luxury travel requests.",
        },
        {
            question: "Do you offer travel insurance?",
            answer:
                "Yes, we provide comprehensive travel insurance options to ensure your journey is protected. Our policies cover trip cancellation, medical emergencies, and luxury item protection.",
        },
        {
            question: "Can you accommodate special dietary requirements?",
            answer:
                "Absolutely! We work closely with all our partners to ensure your dietary preferences and restrictions are met with the highest standards of luxury dining.",
        },
        {
            question: "What is your cancellation policy?",
            answer:
                "Our flexible cancellation policy allows for full refunds up to 30 days before departure. Special terms may apply for peak seasons and exclusive experiences.",
        },
        {
            question: "Do you arrange private jet travel?",
            answer:
                "Yes, we can arrange private jet travel for our clients. We partner with leading private aviation companies to ensure a seamless luxury travel experience.",
        },
    ];

    return (
        <section id="faqs-section" className="py-20 bg-gradient-to-b from-white to-blue-100">
            <div className="max-w-6xl mx-auto px-6">
                {/* 💎 Section Heading */}
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-12 relative">
                    Frequently Asked Questions
                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 h-1 w-20 bg-blue-600 rounded-full"></span>
                </h2>

                {/* FAQ List - Changed to flex-col to ensure visual order matches array order */}
                <div className="flex flex-col space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl transition-all duration-300 hover:shadow-2xl border border-gray-200"
                        >
                            {/* FAQ Question */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center px-6 py-5 bg-white text-blue-900 font-semibold text-lg transition-all duration-300 hover:bg-blue-50 rounded-xl"
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                {faq.question}
                                {openIndex === index ? (
                                    <FaMinus className="text-blue-600 flex-shrink-0 ml-2" />
                                ) : (
                                    <FaPlus className="text-gray-500 flex-shrink-0 ml-2" />
                                )}
                            </button>

                            {/* FAQ Answer - Expanding Section with smooth animation */}
                            <div 
                                id={`faq-answer-${index}`}
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}
                            >
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <p className="text-gray-700">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQs;
