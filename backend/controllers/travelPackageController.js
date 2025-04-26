import TravelPackage from "../models/TravelPackage.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js"; // Import Cloudinary upload service

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

    // Upload image to Cloudinary
    const imageUrl = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);

    // Create a new package with the Cloudinary image URL
    const newPackage = new TravelPackage({
      title,
      location,
      price,
      duration,
      rating,
      image: imageUrl,
      description,
      tripType,
      travelType,
      itinerary: JSON.parse(itinerary), // Convert JSON string to object
      flights: JSON.parse(flights), // Convert JSON string to object
      accommodations: JSON.parse(accommodations), // Convert JSON string to object
      reporting: JSON.parse(reporting), // Convert JSON string to object
    });

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
