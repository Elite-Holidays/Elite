import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CloudArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/clerk-react";

const CreateSlides: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [overlayImages, setOverlayImages] = useState<File[]>([]);
  const [overlayPreviewUrls, setOverlayPreviewUrls] = useState<string[]>([]);
  const [activeOverlayIndex, setActiveOverlayIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: "/admin/create-slides" } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

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

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);
    overlayImages.forEach((file) => formData.append("overlayImages", file));

    try {
      const response = await fetch("http://localhost:8000/api/heroslides", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add slide");

      navigate("/admin/slides", { state: { success: "Slide created successfully" } });
    } catch (error) {
      console.error("Error adding slide:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Hero Slide</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleAddSlide} className="divide-y divide-gray-200">
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
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {image ? (
                        <div className="text-sm text-gray-600">
                          <img 
                            src={imagePreviewUrl} 
                            alt="Main image preview" 
                            className="h-32 mx-auto object-cover rounded-md"
                          />
                          <p className="mt-2">{image.name}</p>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="main-image"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="main-image"
                                name="main-image"
                                type="file"
                                className="sr-only"
                                onChange={handleImageChange}
                                required
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Images (Optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {overlayImages.length > 0 ? (
                        <div className="text-sm text-gray-600">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {overlayPreviewUrls.map((url, index) => (
                              <img 
                                key={index}
                                src={url} 
                                alt={`Overlay preview ${index + 1}`} 
                                className="h-16 w-16 object-cover rounded-md"
                              />
                            ))}
                          </div>
                          <p className="mt-2">{overlayImages.length} images selected</p>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="overlay-images"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload files</span>
                              <input
                                id="overlay-images"
                                name="overlay-images"
                                type="file"
                                multiple
                                className="sr-only"
                                onChange={handleOverlayImagesChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                      Create Slide
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
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <PhotoIcon className="h-16 w-16 mb-4" />
                    <p>Upload a main image to see the preview</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-gray-600 text-sm">
                <p>This preview shows how your slide will appear on the homepage. The overlay images will automatically cycle every 3 seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSlides;