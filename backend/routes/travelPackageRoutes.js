import express from "express";
import upload from "../middleware/multer.js";
import {
  createTravelPackage,
  getAllTravelPackages,
  getTravelPackageById,
  getTravelPackageBySlug,
  deleteTravelPackage,
  updateTravelPackage,
} from "../controllers/travelPackageController.js";

const router = express.Router();

router.post("/create", 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'itineraryPdf', maxCount: 1 }
  ]), 
  createTravelPackage
);
router.get("/", getAllTravelPackages); // Get all packages
router.get("/slug/:slug", getTravelPackageBySlug); // Get a package by slug
router.get("/:id", getTravelPackageById); // Get a package by ID
router.delete("/:id", deleteTravelPackage); // Delete a package by ID
router.put("/:id", 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'itineraryPdf', maxCount: 1 }
  ]), 
  updateTravelPackage
); // Update a package by ID

export default router;
