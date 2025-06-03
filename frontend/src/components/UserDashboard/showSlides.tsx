import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

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
  const [activeOverlayIndices, setActiveOverlayIndices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: "/admin/slides" } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  // Function to add base URL to relative paths if needed
  const fixImageUrl = (url: string): string => {
    if (!url) return 'https://via.placeholder.com/400x300?text=No+Image';
    
    // If it's already an absolute URL (with http or https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL (from your server), add the base URL
    return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Function to handle edit slide
  const handleEditSlide = (slideId: string) => {
    navigate(`/admin/edit-slide/${slideId}`);
  };

  useEffect(() => {
    // Only fetch slides if user is admin
    if (!isLoaded || !isAdmin) return;
    
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/heroslides");
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data: Slide[] = await response.json();
        
        // Process images to ensure they have proper URLs
        const processedSlides = data.map(slide => ({
          ...slide,
          image: fixImageUrl(slide.image),
          overlayImages: slide.overlayImages?.map(img => fixImageUrl(img)) || []
        }));
        
        console.log("Processed slides:", processedSlides);
        setSlides(processedSlides);
        
        // Initialize active overlay indices for all slides
        const initialIndices: Record<string, number> = {};
        processedSlides.forEach(slide => {
          initialIndices[slide._id] = 0;
        });
        setActiveOverlayIndices(initialIndices);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, [isLoaded, isAdmin]);

  // Effect to rotate through overlay images for each slide
  useEffect(() => {
    if (slides.length === 0) return;
    
    const intervalId = setInterval(() => {
      setActiveOverlayIndices(prev => {
        const newIndices = { ...prev };
        
        // Update indices for each slide
        slides.forEach(slide => {
          if (slide.overlayImages?.length) {
            const currentIndex = prev[slide._id] || 0;
            const maxIndex = slide.overlayImages.length - 1;
            newIndices[slide._id] = currentIndex >= maxIndex ? 0 : currentIndex + 1;
          }
        });
        
        return newIndices;
      });
    }, 3000); // Change overlay image every 3 seconds
    
    return () => clearInterval(intervalId);
  }, [slides]);

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    
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
    <div className="max-w-screen-lg mx-auto p-6 pt-24 space-y-6 bg-gray-50 rounded-lg shadow-md">
      {/* Show loading state */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="bg-white p-5 shadow-md flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-all"
        >
          🔙 Back to Admin
        </button>
        <h3 className="text-2xl font-bold text-gray-800">Existing Hero Slides</h3>
        <button
          onClick={() => navigate("/admin/create-slides")}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          + Add New
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-6">
        {slides.length === 0 && !loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No slides found. Create new slides to get started.</p>
            <button
              onClick={() => navigate("/admin/create-slides")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              Create New Slide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {slides.map((slide) => (
              <div
                key={slide._id}
                className="border p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{slide.title}</h4>
                    <p className="text-gray-600 mb-4">{slide.description}</p>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-40 object-cover rounded-md shadow w-full"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditSlide(slide._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {slide.overlayImages && slide.overlayImages.length > 0 && (
                    <div className="md:w-1/2 relative h-[300px]">
                      <h5 className="text-lg font-medium text-gray-700 mb-3">Overlay Images</h5>
                      <div className="relative w-full h-[250px]">
                        {slide.overlayImages.map((img, imgIndex) => {
                          const isActiveOverlay = imgIndex === (activeOverlayIndices[slide._id] || 0);
                          const zIndexValue = isActiveOverlay ? 30 : (10 - imgIndex);
                          
                          return (
                            <div
                              key={imgIndex}
                              className="absolute w-[200px] h-[150px] rounded-lg overflow-hidden shadow-xl transition-all duration-1000"
                              style={{
                                top: `${20 + (imgIndex * 10)}px`,
                                left: `${(imgIndex * 10)}px`,
                                opacity: isActiveOverlay ? 1 : 0.7,
                                transform: `
                                  translateY(${isActiveOverlay ? '-5px' : '0'}) 
                                  scale(${isActiveOverlay ? 1.1 : 0.95}) 
                                  rotate(${imgIndex * 2 - 2}deg)
                                `,
                                zIndex: zIndexValue,
                                transition: 'all 0.8s ease-in-out',
                              }}
                            >
                              <img 
                                src={img} 
                                alt={`${slide.title} highlight ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes gentleFloat {
          0% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.05) translateY(-5px); }
          100% { transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ShowSlides;
