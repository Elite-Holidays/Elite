import express from "express";
import Feature from "../models/Feature.js";

const router = express.Router();

// Get all features
router.get("/", async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Error fetching features", error });
  }
});

// Add a new feature
router.post("/", async (req, res) => {
  try {
    const newFeature = new Feature(req.body);
    await newFeature.save();
    res.status(201).json(newFeature);
  } catch (error) {
    res.status(500).json({ message: "Error adding feature", error });
  }
});

export default router;
