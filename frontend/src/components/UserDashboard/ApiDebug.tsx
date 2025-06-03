import React, { useEffect, useState } from 'react';

const ApiDebug: React.FC = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/heroslides");
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data = await response.json();
        setSlides(data);
        console.log("API Response:", data);
      } catch (error: any) {
        console.error("Error fetching slides:", error);
        setError(error.message || "Failed to fetch slides");
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Debug</h2>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Found {slides.length} slides</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Overlay Images</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide, index) => (
                  <tr key={slide._id || index}>
                    <td className="py-2 px-4 border">{slide._id}</td>
                    <td className="py-2 px-4 border">{slide.title}</td>
                    <td className="py-2 px-4 border">
                      <div className="w-32 h-24 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {slide.image ? (
                          <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="max-w-full max-h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                          />
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 break-all">{slide.image}</p>
                    </td>
                    <td className="py-2 px-4 border">
                      {slide.overlayImages && slide.overlayImages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {slide.overlayImages.map((img: string, i: number) => (
                            <div key={i} className="relative w-16 h-16 bg-gray-200 overflow-hidden">
                              <img 
                                src={img} 
                                alt={`Overlay ${i}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null;
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No overlay images</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebug; 