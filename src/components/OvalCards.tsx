import React from "react";
import { useNavigate } from "react-router-dom";
import { das } from "../data";

const OvalCards: React.FC = () => {
    const navigate = useNavigate();

    const handleExploreClick = (title: string) => {
        if (title === "Group Trip") {
            navigate("/group");
        } if (title === "Honey Moon") {
            navigate("/honeymoon");
        }if (title === "Family Trip") {
            navigate("/familytrip");
        }if (title === "Solo Trip") {
            navigate("/solotrip");
        }
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                    What we offer...
                </h2>
                <div className="flex flex-wrap justify-center gap-10">
                    {das.slice(0, 4).map((card, index) => (
                        <div key={index} className="flex flex-col items-center relative group">
                            <div
                                className="w-52 h-72 bg-white p-6 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 relative overflow-hidden"
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <p className="text-white text-sm p-4 text-center">{card.description}</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-black mt-4">{card.title}</h3>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={() => handleExploreClick(card.title)}
                            >
                                Explore Location
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OvalCards;
