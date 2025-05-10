import TravelPackage from "../models/TravelPackage.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js"; // Import Cloudinary upload service

// Helper function to generate a URL-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

// Create a new Travel Package
export const createTravelPackage = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      duration,
      rating,
      description,
      tripType,
      travelType,
      isPopular,
      itineraryMode,
      itinerary,
      flights,
      accommodations,
      reporting,
    } = req.body;

    // Validate `tripType` and `travelType`
    if (!["Honeymoon", "Group Trip", "Family Trip", "Solo Trip"].includes(tripType)) {
      return res.status(400).json({ message: "Invalid tripType value" });
    }

    if (!["Domestic", "International"].includes(travelType)) {
      return res.status(400).json({ message: "Invalid travelType value" });
    }

    // Generate slug from title
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists, if so, append a number
    while (await TravelPackage.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadFileToCloudinary(req.files.image[0].buffer, req.files.image[0].mimetype);

    // Create package data object
    const packageData = {
      title,
      slug,
      location,
      price,
      duration,
      rating,
      image: imageUrl,
      description,
      tripType,
      travelType,
      isPopular: isPopular === 'true', // Convert to boolean
      itineraryMode,
    };

    // Handle optional fields
    if (flights) {
      packageData.flights = JSON.parse(flights);
    }

    if (accommodations) {
      packageData.accommodations = JSON.parse(accommodations);
    }

    if (reporting) {
      packageData.reporting = JSON.parse(reporting);
    }

    // Handle itinerary based on the mode
    if (itineraryMode === "manual") {
      packageData.itinerary = JSON.parse(itinerary);
    } else if (itineraryMode === "pdf" && req.files.itineraryPdf) {
      // Upload itinerary PDF to Cloudinary
      const pdfUrl = await uploadFileToCloudinary(
        req.files.itineraryPdf[0].buffer, 
        req.files.itineraryPdf[0].mimetype,
        "itinerary_pdfs"
      );
      packageData.itineraryPdf = pdfUrl;
      packageData.itinerary = []; // Empty array for itinerary when using PDF mode
    }

    // Create a new package
    const newPackage = new TravelPackage(packageData);

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Travel Packages
export const getAllTravelPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Travel Package by ID
export const getTravelPackageById = async (req, res) => {
  try {
    const packageId = req.params.id;
    const travelPackage = await TravelPackage.findById(packageId);

    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(travelPackage);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a Travel Package by ID
export const deleteTravelPackage = async (req, res) => {
  try {
    const deletedPackage = await TravelPackage.findByIdAndDelete(req.params.id);
    if (!deletedPackage) return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Travel Package by Slug
export const getTravelPackageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const travelPackage = await TravelPackage.findOne({ slug });

    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(travelPackage);
  } catch (error) {
    console.error("Error fetching package by slug:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a Travel Package by ID
export const updateTravelPackage = async (req, res) => {
  try {
    console.log("Update request received for ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const packageId = req.params.id;
    const {
      title,
      location,
      price,
      duration,
      rating,
      description,
      tripType,
      travelType,
      isPopular,
      itineraryMode,
      itinerary,
      flights,
      accommodations,
      reporting,
    } = req.body;

    // Find the package to update
    const existingPackage = await TravelPackage.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    console.log("Found existing package:", existingPackage._id);

    // Validate `tripType` and `travelType`
    if (tripType && !["Honeymoon", "Group Trip", "Family Trip", "Solo Trip"].includes(tripType)) {
      return res.status(400).json({ message: "Invalid tripType value" });
    }

    if (travelType && !["Domestic", "International"].includes(travelType)) {
      return res.status(400).json({ message: "Invalid travelType value" });
    }

    // Create update data object
    const updateData = {
      title: title || existingPackage.title,
      location: location || existingPackage.location,
      price: price || existingPackage.price,
      duration: duration || existingPackage.duration,
      rating: rating || existingPackage.rating,
      description: description || existingPackage.description,
      tripType: tripType || existingPackage.tripType,
      travelType: travelType || existingPackage.travelType,
      isPopular: isPopular === undefined ? existingPackage.isPopular : isPopular === 'true',
      itineraryMode: itineraryMode || existingPackage.itineraryMode,
    };

    console.log("Update data prepared:", updateData);

    // Update slug if title changed
    if (title && title !== existingPackage.title) {
      let baseSlug = generateSlug(title);
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists and isn't the current package's slug
      while (await TravelPackage.findOne({ slug, _id: { $ne: packageId } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      updateData.slug = slug;
    }

    // Handle optional fields
    if (flights) {
      try {
        updateData.flights = JSON.parse(flights);
      } catch (e) {
        console.error("Error parsing flights:", e);
      }
    }

    if (accommodations) {
      try {
        updateData.accommodations = JSON.parse(accommodations);
      } catch (e) {
        console.error("Error parsing accommodations:", e);
      }
    }

    if (reporting) {
      try {
        updateData.reporting = JSON.parse(reporting);
      } catch (e) {
        console.error("Error parsing reporting:", e);
      }
    }

    // Handle image if provided
    if (req.files && req.files.image && req.files.image.length > 0) {
      try {
        const imageUrl = await uploadFileToCloudinary(req.files.image[0].buffer, req.files.image[0].mimetype);
        updateData.image = imageUrl;
      } catch (e) {
        console.error("Error uploading image:", e);
      }
    }

    // Handle itinerary based on the mode
    if (itineraryMode === "manual" && itinerary) {
      try {
        const parsedItinerary = JSON.parse(itinerary);
        
        // Check if itinerary has valid data or keep existing itinerary
        const hasValidItineraryData = parsedItinerary.length > 0 && 
          parsedItinerary.every(item => 
            item.day && item.day.trim() !== "" && 
            item.date && item.date.trim() !== "" && 
            item.details && item.details.trim() !== ""
          );
        
        if (hasValidItineraryData) {
          updateData.itinerary = parsedItinerary;
          updateData.itineraryPdf = null; // Clear PDF if switching to manual mode
        } else if (parsedItinerary.length === 0 || !hasValidItineraryData) {
          // If empty or invalid itinerary was sent, keep the existing one
          updateData.itinerary = existingPackage.itinerary;
        }
      } catch (e) {
        console.error("Error parsing itinerary:", e);
        // Keep existing itinerary if parsing fails
        updateData.itinerary = existingPackage.itinerary;
      }
    } else if (itineraryMode === "pdf") {
      // Check if a new PDF was uploaded
      if (req.files && req.files.itineraryPdf && req.files.itineraryPdf.length > 0) {
        try {
          // Upload itinerary PDF to Cloudinary
          const pdfUrl = await uploadFileToCloudinary(
            req.files.itineraryPdf[0].buffer, 
            req.files.itineraryPdf[0].mimetype,
            "itinerary_pdfs"
          );
          updateData.itineraryPdf = pdfUrl;
          // For PDF mode, set a valid placeholder itinerary to satisfy validation
          updateData.itinerary = [{
            day: "PDF",
            date: "PDF",
            details: "See attached PDF for detailed itinerary"
          }];
        } catch (e) {
          console.error("Error uploading itinerary PDF:", e);
        }
      } 
      // If the user wants to keep the existing PDF
      else if (req.body.keepExistingPdf === "true" && existingPackage.itineraryPdf) {
        console.log("Keeping existing PDF:", existingPackage.itineraryPdf);
        // No need to update itineraryPdf as it's already in the DB
        // Just ensure we have a valid itinerary
        updateData.itinerary = [{
          day: "PDF",
          date: "PDF",
          details: "See attached PDF for detailed itinerary"
        }];
      }
    }

    console.log("Final update data:", JSON.stringify(updateData));

    // Update the package
    const updatedPackage = await TravelPackage.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("Updated package:", updatedPackage._id);
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: error.message });
  }
};
