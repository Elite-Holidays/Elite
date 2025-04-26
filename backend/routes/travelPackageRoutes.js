import express from "express";
import upload from "../middleware/multer.js";
import {
  createTravelPackage,
  getAllTravelPackages,
  getTravelPackageById,
  deleteTravelPackage,
} from "../controllers/travelPackageController.js";

const router = express.Router();

router.post("/create", upload.single("image"), createTravelPackage); // Upload a single image
router.get("/", getAllTravelPackages); // Get all packages
router.get("/:id", getTravelPackageById); // Get a package by ID
router.delete("/:id", deleteTravelPackage); // Delete a package by ID

export default router;
