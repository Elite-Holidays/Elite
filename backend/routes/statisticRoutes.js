import express from "express";
import Statistic from "../models/Statistic.js";

const router = express.Router();

// Get all statistics
router.get("/", async (req, res) => {
  try {
    const statistics = await Statistic.find();
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
});

// Add a new statistic
router.post("/", async (req, res) => {
  try {
    const newStatistic = new Statistic(req.body);
    await newStatistic.save();
    res.status(201).json(newStatistic);
  } catch (error) {
    res.status(500).json({ message: "Error adding statistic", error });
  }
});

export default router;
