import express from "express";
import HeroSlide from "../models/HeroSlide.js";
import upload from "../middleware/multer.js";
import { uploadFileToCloudinary, uploadMultipleFilesToCloudinary } from "../services/cloudinaryService.js";

const router = express.Router();

// ✅ Create a new hero slide (with Cloudinary upload)
router.post("/", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "overlayImages", maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Upload main image
    const image = req.files["image"] ? await uploadFileToCloudinary(req.files["image"][0].buffer, req.files["image"][0].mimetype) : null;

    // Upload overlay images (if any)
    const overlayImages = req.files["overlayImages"] ? await uploadMultipleFilesToCloudinary(req.files["overlayImages"]) : [];

    const newSlide = new HeroSlide({ title, description, image, overlayImages });
    await newSlide.save();

    res.status(201).json(newSlide);
  } catch (error) {
    res.status(500).json({ error: "Failed to create hero slide" });
  }
});

// ✅ Get all hero slides
router.get("/", async (req, res) => {
  try {
    const slides = await HeroSlide.find();
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
});

// ✅ Get a single hero slide by ID
router.get("/:id", async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: "Hero slide not found" });
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hero slide" });
  }
});

// ✅ Update a hero slide (with Cloudinary upload)
router.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "overlayImages", maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: "Slide not found" });

    // Upload new images if provided
    const image = req.files["image"] ? await uploadFileToCloudinary(req.files["image"][0].buffer, req.files["image"][0].mimetype) : slide.image;
    const overlayImages = req.files["overlayImages"] ? await uploadMultipleFilesToCloudinary(req.files["overlayImages"]) : slide.overlayImages;

    slide.title = title || slide.title;
    slide.description = description || slide.description;
    slide.image = image;
    slide.overlayImages = overlayImages;

    await slide.save();
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ error: "Failed to update hero slide" });
  }
});

// ✅ Delete a hero slide
router.delete("/:id", async (req, res) => {
  try {
    const deletedSlide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!deletedSlide) return res.status(404).json({ error: "Slide not found" });
    res.status(200).json({ message: "Hero slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hero slide" });
  }
});

export default router;
