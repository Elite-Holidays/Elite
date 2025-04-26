import React from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import { aboutUs, office } from "../data";

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Page Container */}
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
                <h1 className="text-5xl font-bold mb-8 text-center">About Elite Holidays</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <p className="text-xl text-gray-600 leading-relaxed mb-6">
                            Founded in 2018, Elite Holidays has been at the forefront of luxury
                            travel, crafting unforgettable experiences for discerning travelers
                            worldwide.
                        </p>
                        <p className="text-xl text-gray-600 leading-relaxed mb-6">
                            Our commitment to excellence, attention to detail, and personalized
                            service has earned us recognition as one of the world's premier
                            luxury travel companies.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mt-8">
                            <div className="text-center p-6 bg-blue-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                                <div className="text-gray-600">Years Experience</div>
                            </div>
                            <div className="text-center p-6 bg-blue-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                                <div className="text-gray-600">Travel Experts</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            src={office[0].image}
                            className="rounded-xl shadow-2xl w-full h-auto object-cover"
                            alt={office[0].name}
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[ 
                        { id: 1, title: "Award-Winning Service", icon: GiTrophy, desc: "Recognized globally for our exceptional service and attention to detail." },
                        { id: 2, title: "Global Network", icon: AiOutlineGlobal, desc: "Extensive partnerships with luxury hotels and exclusive experiences worldwide." },
                        { id: 3, title: "Personalized Care", icon: FaHandHoldingHeart, desc: "Dedicated travel consultants available 24/7 for your peace of mind." }
                    ].map(({ id, title, icon: Icon, desc }) => (
                        <div key={id} className="p-8 bg-white rounded-xl shadow-lg text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon className="text-blue-600 text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{title}</h3>
                            <p className="text-gray-600">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Leadership Team */}
                <div className="bg-gray-50 rounded-2xl p-12 mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Leadership Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {aboutUs.map(({ id, name, designation, image }) => (
                            <div key={id} className="text-center">
                                <img src={image} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" alt={name} />
                                <h4 className="font-bold mb-1">{name}</h4>
                                <p className="text-gray-600">{designation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;