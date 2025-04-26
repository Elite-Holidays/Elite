import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define Slide type
interface Slide {
  _id: string;
  title: string;
  description: string;
  image: string;
  overlayImages?: string[];
}

const ShowSlides: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/heroslides");
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data: Slide[] = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    fetchSlides();
  }, []);

  const handleDeleteSlide = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/heroslides/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete slide");
      setSlides((prevSlides) => prevSlides.filter((slide) => slide._id !== id));
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6 mt-20 space-y-6 bg-gray-50 rounded-lg shadow-md">
      {/* Sticky Header */}
      <div className="bg-white p-5 shadow-md flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-all"
        >
          🔙 Back to Admin
        </button>
        <h3 className="text-2xl font-bold text-gray-800">Existing Hero Slides</h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className="border p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <h4 className="text-xl font-semibold text-gray-800">{slide.title}</h4>
              <p className="text-gray-600">{slide.description}</p>
              <img
                src={slide.image}
                alt={slide.title}
                className="h-40 object-cover my-3 rounded-md shadow w-full"
              />
              <div className="flex gap-2 overflow-x-auto">
                {slide.overlayImages?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Overlay ${index}`}
                    className="w-14 h-14 object-cover rounded-md shadow-sm"
                  />
                ))}
              </div>
              <button
                onClick={() => handleDeleteSlide(slide._id)}
                className="bg-red-500 text-white px-4 py-2 mt-3 rounded-md hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowSlides;
