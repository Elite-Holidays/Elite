import HeroSlide from "../models/HeroSlide.js";
import { uploadMultipleFilesToCloudinary } from "../services/cloudinaryService.js";

/**
 * @desc Create a new hero slide
 * @route POST /api/hero-slide
 */
export const createHeroSlide = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Upload images to Cloudinary
    const uploadedImages = await uploadMultipleFilesToCloudinary(req.files);

    const newSlide = new HeroSlide({
      title,
      description,
      image: uploadedImages[0], // Main image
      overlayImages: uploadedImages.slice(1), // Other images
    });

    await newSlide.save();
    res.status(201).json(newSlide);
  } catch (error) {
    res.status(500).json({ error: "Failed to create hero slide", details: error.message });
  }
};

/**
 * @desc Get all hero slides
 * @route GET /api/hero-slide
 */
export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find();
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
};

/**
 * @desc Get a single hero slide by ID
 * @route GET /api/hero-slide/:id
 */
export const getHeroSlideById = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: "Hero slide not found" });
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hero slide" });
  }
};

/**
 * @desc Update a hero slide
 * @route PUT /api/hero-slide/:id
 */
export const updateHeroSlide = async (req, res) => {
  try {
    const updatedSlide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSlide) return res.status(404).json({ error: "Slide not found" });
    res.status(200).json(updatedSlide);
  } catch (error) {
    res.status(500).json({ error: "Failed to update hero slide" });
  }
};

/**
 * @desc Delete a hero slide
 * @route DELETE /api/hero-slide/:id
 */
export const deleteHeroSlide = async (req, res) => {
  try {
    const deletedSlide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!deletedSlide) return res.status(404).json({ error: "Slide not found" });
    res.status(200).json({ message: "Hero slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hero slide" });
  }
};
