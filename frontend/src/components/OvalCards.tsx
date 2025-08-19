import React from "react";
import { useNavigate } from "react-router-dom";
import { das } from "../data";

const OvalCards: React.FC = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate("/more-destinations");
    };

    return (
        <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black mb-6 tracking-tight">
                        <span className="relative inline-block">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Experience</span>
                            <span className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-300 opacity-50 rounded-lg"></span>
                        </span>
                        {" "}
                        <span className="text-gray-800">Your Way</span>
                    </h2>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto">Choose your perfect travel style</p>
                </div>
                
                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-300 rounded-full opacity-20"></div>
                    
                    <div className="grid grid-cols-12 gap-6">
                        {das.map((card, index) => {
                            // Alternate card layouts for uniqueness
                            const isEven = index % 2 === 0;
                            const colSpan = isEven ? "col-span-12 md:col-span-6" : "col-span-12 md:col-span-6";
                            
                            return (
                                <div 
                                    key={index} 
                                    className={`${colSpan} group`}
                                >
                                    <div className={`relative overflow-hidden ${isEven ? 'rounded-[2.5rem]' : 'rounded-[4rem_1rem]'} shadow-lg h-[400px] transform transition-all duration-500 hover:shadow-2xl`}>
                                        {/* Background image with overlay */}
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={card.image}
                                                alt={card.title}
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                            />
                                            <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-tr from-blue-900/80 via-blue-800/60 to-transparent' : 'bg-gradient-to-bl from-indigo-900/80 via-purple-800/60 to-transparent'}`}></div>
                                        </div>
                                        
                                        {/* Content positioned differently based on index */}
                                        <div className={`absolute z-10 p-10 ${isEven ? 'bottom-0 left-0' : 'top-0 right-0'} w-full md:w-3/4 h-full flex flex-col ${isEven ? 'justify-end' : 'justify-start'}`}>
                                            <h3 className={`text-3xl font-bold text-white mb-4 ${isEven ? '' : 'text-right'}`}>{card.title}</h3>
                                            
                                            <p className={`text-white/90 text-lg mb-6 ${isEven ? '' : 'text-right'}`}>
                                                {card.description}
                                            </p>
                                            
                                            <div className={`${isEven ? '' : 'self-end'}`}>
                                                <button
                                                    onClick={handleExploreClick}
                                                    className={`relative overflow-hidden group-hover:bg-white px-8 py-3 rounded-full ${isEven ? 'bg-yellow-400 text-blue-900' : 'bg-blue-400 text-indigo-900'} font-semibold transition-all duration-300 group-hover:shadow-xl`}
                                                >
                                                    Discover {card.title}
                                                    <span className={`absolute bottom-0 left-0 w-full h-1 ${isEven ? 'bg-blue-600' : 'bg-purple-600'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Decorative elements */}
                                        <div className={`absolute ${isEven ? 'top-6 right-6' : 'bottom-6 left-6'} w-12 h-12 border-4 ${isEven ? 'border-yellow-300' : 'border-blue-300'} rounded-full opacity-70`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OvalCards;
