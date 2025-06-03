import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getApiUrl } from "../../utils/apiConfig";

interface ItineraryDetails {
  day: string;
  date: string;
  details: string;
}

const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Security check - redirect if not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      navigate("/login", { state: { from: "/admin/create-package" } });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  const [travelTitle, setTravelTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [travelImage, setTravelImage] = useState<File | null>(null);
  const [travelDescription, setTravelDescription] = useState("");
  const [tripType, setTripType] = useState("");
  const [travelType, setTravelType] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [itineraryMode, setItineraryMode] = useState<"manual" | "pdf">("pdf");
  const [itineraryPdf, setItineraryPdf] = useState<File | null>(null);

  const [itinerary, setItinerary] = useState<ItineraryDetails[]>([
    { day: "", date: "", details: "" },
  ]);

  const handleAddField = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, state: T[], initialState: T) => {
    setter([...state, initialState]);
  };

  const handleChange = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    _: T[], // Renamed to underscore to indicate it's not used
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

  const handleAddTravelPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", travelTitle);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("rating", rating);
    formData.append("description", travelDescription);
    formData.append("tripType", tripType);
    formData.append("travelType", travelType);
    formData.append("isPopular", isPopular.toString());
    formData.append("itineraryMode", itineraryMode);
    
    if (itineraryMode === "manual") {
      formData.append("itinerary", JSON.stringify(itinerary));
    } else if (itineraryMode === "pdf" && itineraryPdf) {
      formData.append("itineraryPdf", itineraryPdf);
    }
    
    if (travelImage) formData.append("image", travelImage);

    try {
      const response = await fetch(
        getApiUrl("/api/travelpackages/create"),
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to add travel package");

      navigate("/admin/packages");
    } catch (error) {
      console.error("Error adding travel package:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h2 className="text-2xl font-bold">Create New Travel Package</h2>
            <p className="text-blue-100">Fill in the details below to add a new travel package</p>
          </div>

          <form onSubmit={handleAddTravelPackage} className="p-6 space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                    <input
                      type="text"
                      placeholder="e.g., 1299"
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
                      placeholder="e.g., 7 days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input
                      type="text"
                      placeholder="e.g., 4.5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type</label>
                    <select
                      value={travelType}
                      onChange={(e) => setTravelType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    >
                      <option value="" disabled>Select Type</option>
                      <option value="Domestic">Domestic</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Group Trip">Group Trip</option>
                    <option value="Family Trip">Family Trip</option>
                    <option value="Solo Trip">Solo Trip</option>
                  </select>
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
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Package Image</h3>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    {travelImage ? (
                      <div className="p-4 text-center">
                        <img 
                          src={URL.createObjectURL(travelImage)} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-md"
                        />
                        <p className="mt-2 text-sm text-gray-600">{travelImage.name}</p>
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
                      onChange={(e) => e.target.files && setTravelImage(e.target.files[0])}
                      className="hidden" 
                      required
                      accept="image/*"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Detailed description of the package..."
                    value={travelDescription}
                    onChange={(e) => setTravelDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Itinerary Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Itinerary</h3>
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
                      onChange={(e) => e.target.files && setItineraryPdf(e.target.files[0])}
                      className="hidden"
                      required={itineraryMode === "pdf"}
                      accept="application/pdf"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Form Actions */}
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;