import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface ItineraryDetails {
  day: string;
  date: string;
  details: string;
}

interface TravelPackage {
  _id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  description: string;
  tripType: string;
  travelType: string;
  isPopular?: boolean;
  itinerary: ItineraryDetails[];
  itineraryPdf?: string;
  itineraryMode?: "manual" | "pdf";
  createdAt: string;
  updatedAt: string;
}

const EditPackage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: `/admin/edit-package/${packageId}` } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate, packageId]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [travelTitle, setTravelTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [travelImage, setTravelImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [travelDescription, setTravelDescription] = useState("");
  const [tripType, setTripType] = useState("");
  const [travelType, setTravelType] = useState("");
  const [itineraryMode, setItineraryMode] = useState<"manual" | "pdf">("manual");
  const [itineraryPdf, setItineraryPdf] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null);
  const [isPopular, setIsPopular] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [itinerary, setItinerary] = useState<ItineraryDetails[]>([
    { day: "", date: "", details: "" },
  ]);

  // Fetch package data when component mounts
  useEffect(() => {
    // Only fetch package if user is admin
    if (!isLoaded || !isAdmin || !packageId) return;
    
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/api/travelpackages/${packageId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch package");
        }
        
        const data: TravelPackage = await response.json();
        
        // Set form fields with package data
        setTravelTitle(data.title);
        setLocation(data.location);
        setPrice(data.price.toString());
        setDuration(data.duration);
        setRating(data.rating.toString());
        setTravelDescription(data.description);
        setTripType(data.tripType);
        setTravelType(data.travelType);
        setIsPopular(data.isPopular || false);
        setImagePreview(fixImageUrl(data.image));
        
        // Set itinerary mode and data
        if (data.itineraryPdf) {
          setItineraryMode("pdf");
          // Store the URL of the existing PDF
          setExistingPdfUrl(data.itineraryPdf);
        } else {
          setItineraryMode("manual");
        }
        
        // Set itinerary data
        if (data.itinerary && data.itinerary.length > 0) {
          setItinerary(data.itinerary);
        }
        
      } catch (error) {
        console.error("Error fetching package:", error);
        setError("Failed to load package data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [isLoaded, isAdmin, packageId]);

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

  const handleAddField = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, state: T[], initialState: T) => {
    setter([...state, initialState]);
  };

  const handleChange = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    state: T[],
    index: number,
    field: keyof T,
    value: string
  ) => {
    setter((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], [field]: value };
      return newState;
    });
  };

  const handleRemoveField = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    state: T[],
    index: number
  ) => {
    setter(state.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setTravelImage(selectedFile);
      
      // Create a preview URL for the main image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Function to handle PDF viewing in multiple ways
  const handleViewPdf = (e: React.MouseEvent, pdfUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPdfModal(true);
  };

  // Function to properly download PDF with correct filename
  const downloadPdf = async (pdfUrl: string, fileName: string) => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      window.open(pdfUrl, '_blank');
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", travelTitle);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("rating", rating);
    formData.append("description", travelDescription);
    formData.append("tripType", tripType);
    formData.append("travelType", travelType);
    formData.append("itineraryMode", itineraryMode);
    formData.append("isPopular", isPopular.toString());
    
    if (itineraryMode === "manual") {
      // Only include itinerary if it has at least one valid item
      const hasValidItinerary = itinerary.some(item => 
        item.day.trim() !== "" && 
        item.date.trim() !== "" && 
        item.details.trim() !== ""
      );
      
      if (hasValidItinerary) {
        // Filter out any empty itinerary items
        const validItinerary = itinerary.filter(item => 
          item.day.trim() !== "" && 
          item.date.trim() !== "" && 
          item.details.trim() !== ""
        );
        formData.append("itinerary", JSON.stringify(validItinerary));
      }
    } else if (itineraryMode === "pdf") {
      // If a new PDF was uploaded, use it
      if (itineraryPdf) {
        formData.append("itineraryPdf", itineraryPdf);
      } 
      // If we're using the existing PDF, send its URL to maintain it
      else if (existingPdfUrl) {
        formData.append("keepExistingPdf", "true");
      }
    }
    
    if (travelImage) formData.append("image", travelImage);

    try {
      const response = await fetch(
        `http://localhost:8000/api/travelpackages/${packageId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      console.log("Response status:", response.status);
      const responseData = await response.json().catch(e => ({ error: "Failed to parse JSON response" }));
      console.log("Response data:", responseData);

      if (!response.ok) throw new Error(`Failed to update travel package: ${responseData.message || response.statusText}`);

      navigate("/admin/packages");
    } catch (error) {
      console.error("Error updating travel package:", error);
      setIsSubmitting(false);
      // Show error to user
      setError(error instanceof Error ? error.message : "An unknown error occurred");
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
            onClick={() => navigate("/admin/packages")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-28">
      {/* PDF Modal Viewer */}
      {showPdfModal && existingPdfUrl && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-lg shadow-xl">
            <div className="absolute top-0 right-0 p-2">
              <button
                onClick={() => setShowPdfModal(false)}
                className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="h-full p-1">
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(existingPdfUrl)}&embedded=true`}
                className="w-full h-full border-0"
                title="PDF Viewer"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  // If Google Docs viewer fails, try direct PDF
                  if (iframe.contentDocument?.body.innerText.includes('Not Found') || 
                      iframe.contentDocument?.body.children.length === 0) {
                    iframe.src = existingPdfUrl;
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h2 className="text-2xl font-bold">Edit Travel Package</h2>
            <p className="text-blue-100">Update the details of this travel package</p>
          </div>

          <form onSubmit={handleUpdatePackage} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Bali Adventure Package"
                    value={travelTitle}
                    onChange={(e) => setTravelTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Bali, Indonesia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    placeholder="e.g., 50000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 5 Days / 4 Nights"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="e.g., 4.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Package Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Package Image</h3>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    {imagePreview ? (
                      <div className="p-4 text-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-md"
                        />
                        <p className="mt-2 text-sm text-gray-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Description & Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Package Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe the travel package..."
                  value={travelDescription}
                  onChange={(e) => setTravelDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="">Select Trip Type</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Group Trip">Group Trip</option>
                    <option value="Family Trip">Family Trip</option>
                    <option value="Solo Trip">Solo Trip</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type</label>
                  <select
                    value={travelType}
                    onChange={(e) => setTravelType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="">Select Travel Type</option>
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Popular Trip Checkbox */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-800 font-medium">Mark as Popular Trip (will appear in Popular Trips section)</span>
              </label>
            </div>

            {/* Itinerary Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Itinerary</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-700">Entry Method:</label>
                    <div className="relative inline-flex">
                      <select
                        value={itineraryMode}
                        onChange={(e) => setItineraryMode(e.target.value as "manual" | "pdf")}
                        className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="manual">Manual Entry</option>
                        <option value="pdf">PDF Upload</option>
                      </select>
                    </div>
                  </div>
                  {itineraryMode === "manual" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddField(setItinerary, itinerary, {
                          day: "",
                          date: "",
                          details: "",
                        })
                      }
                      className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Day
                    </button>
                  )}
                </div>
              </div>
              
              {itineraryMode === "manual" ? (
                <div className="space-y-3">
                  {itinerary.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                        <input
                          type="text"
                          placeholder="Day 1"
                          value={item.day}
                          onChange={(e) =>
                            handleChange(
                              setItinerary,
                              itinerary,
                              index,
                              "day",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            handleChange(
                              setItinerary,
                              itinerary,
                              index,
                              "date",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="md:col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Activity details"
                            value={item.details}
                            onChange={(e) =>
                              handleChange(
                                setItinerary,
                                itinerary,
                                index,
                                "details",
                                e.target.value
                              )
                            }
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                          {itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveField(setItinerary, itinerary, index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    {itineraryPdf ? (
                      <div className="p-4 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-md font-medium text-gray-800">{itineraryPdf.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{Math.round(itineraryPdf.size / 1024)} KB</p>
                        <button 
                          type="button"
                          onClick={() => setItineraryPdf(null)}
                          className="mt-3 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ) : existingPdfUrl ? (
                      <div className="p-4 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-md font-medium text-gray-800">Existing PDF Itinerary</p>
                        <p className="mt-1 text-sm text-gray-500">Click to replace or use buttons below</p>
                        <div className="mt-3 flex justify-center space-x-2">
                          <a 
                            href={existingPdfUrl}
                            onClick={(e) => handleViewPdf(e, existingPdfUrl)}
                            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            View in Browser
                          </a>
                          <button 
                            className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const fileName = `itinerary_${new Date().getTime()}.pdf`;
                              downloadPdf(existingPdfUrl, fileName);
                            }}
                          >
                            Download PDF
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-12 h-12 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          setItineraryPdf(e.target.files[0]);
                          setExistingPdfUrl(null); // Clear existing PDF reference when new one is uploaded
                        }
                      }}
                      className="hidden"
                      accept="application/pdf"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/packages")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    Update Package
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPackage; 