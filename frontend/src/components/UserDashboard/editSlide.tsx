import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CloudArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/clerk-react";

interface Slide {
  _id: string;
  title: string;
  description: string;
  image: string;
  overlayImages?: string[];
}

const EditSlide: React.FC = () => {
  const { slideId } = useParams<{ slideId: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [overlayImages, setOverlayImages] = useState<File[]>([]);
  const [overlayPreviewUrls, setOverlayPreviewUrls] = useState<string[]>([]);
  const [activeOverlayIndex, setActiveOverlayIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: `/admin/edit-slide/${slideId}` } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate, slideId]);

  // Fetch the slide data
  useEffect(() => {
    // Only fetch slide if user is admin
    if (!isLoaded || !isAdmin || !slideId) return;
    
    const fetchSlide = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/api/heroslides/${slideId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch slide");
        }
        
        const data: Slide = await response.json();
        
        // Set form fields
        setTitle(data.title);
        setDescription(data.description);
        setImagePreviewUrl(fixImageUrl(data.image));
        
        // Set overlay image previews if they exist
        if (data.overlayImages && data.overlayImages.length > 0) {
          setOverlayPreviewUrls(data.overlayImages.map(img => fixImageUrl(img)));
        }
        
      } catch (error) {
        console.error("Error fetching slide:", error);
        setError("Failed to load slide data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlide();
  }, [isLoaded, isAdmin, slideId]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create a preview URL for the main image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleOverlayImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setOverlayImages(selectedFiles);
      
      // Create preview URLs for all overlay images
      const previewUrls: string[] = [];
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewUrls.push(reader.result as string);
          if (previewUrls.length === selectedFiles.length) {
            setOverlayPreviewUrls(previewUrls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Rotate through overlay images
  useEffect(() => {
    if (overlayPreviewUrls.length === 0) return;
    
    const intervalId = setInterval(() => {
      setActiveOverlayIndex(prevIndex => 
        prevIndex >= overlayPreviewUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [overlayPreviewUrls]);

  const handleUpdateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);
    overlayImages.forEach((file) => formData.append("overlayImages", file));

    try {
      const response = await fetch(`http://localhost:8000/api/heroslides/${slideId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update slide");

      navigate("/admin/slides", { state: { success: "Slide updated successfully" } });
    } catch (error) {
      console.error("Error updating slide:", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex justify-center items-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/slides")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/slides")}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Hero Slide</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleUpdateSlide} className="divide-y divide-gray-200">
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Main Image
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      {imagePreviewUrl && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">Current Image:</p>
                          <img
                            src={imagePreviewUrl}
                            alt="Current main image"
                            className="mt-2 max-h-40 mx-auto rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="overlayImages" className="block text-sm font-medium text-gray-700 mb-1">
                    Overlay Images (Optional)
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="overlayImages"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="overlayImages"
                            name="overlayImages"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleOverlayImagesChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      {overlayPreviewUrls.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">Current Overlay Images: {overlayPreviewUrls.length}</p>
                          <div className="mt-2 flex flex-wrap gap-2 justify-center">
                            {overlayPreviewUrls.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Overlay image ${index + 1}`}
                                className="h-20 w-20 object-cover rounded"
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Note: Uploading new overlay images will replace all existing ones
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => navigate("/admin/slides")}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <CloudArrowUpIcon className="h-5 w-5 mr-2 animate-pulse" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                      Update Slide
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Preview</h2>
              
              <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
                {imagePreviewUrl ? (
                  <>
                    {/* Main image preview */}
                    <img 
                      src={imagePreviewUrl} 
                      alt="Main slide preview" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                      <div className="p-8 h-full flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-white mb-4">{title || "Your Slide Title"}</h3>
                        <p className="text-gray-200 mb-6">{description || "Your slide description will appear here..."}</p>
                      </div>
                    </div>
                    
                    {/* Overlay images with animation */}
                    {overlayPreviewUrls.length > 0 && (
                      <div className="absolute right-8 bottom-8 w-[300px] h-[250px]">
                        {overlayPreviewUrls.map((url, imgIndex) => {
                          const isActiveOverlay = imgIndex === activeOverlayIndex;
                          
                          return (
                            <div
                              key={imgIndex}
                              className="absolute w-[180px] h-[120px] rounded-lg overflow-hidden shadow-xl transition-all duration-1000"
                              style={{
                                bottom: `${(imgIndex * 10)}px`,
                                right: `${(imgIndex * 10)}px`,
                                opacity: isActiveOverlay ? 1 : 0.7,
                                transform: `
                                  translateY(${isActiveOverlay ? '-10px' : '0'}) 
                                  scale(${isActiveOverlay ? 1.1 : 0.95}) 
                                  rotate(${imgIndex * 2 - 2}deg)
                                `,
                                zIndex: isActiveOverlay ? 30 : (10 - imgIndex),
                                transition: 'all 0.8s ease-in-out',
                              }}
                            >
                              <img 
                                src={url} 
                                alt={`Overlay preview ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSlide; 