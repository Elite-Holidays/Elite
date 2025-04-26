import express from "express";
import upload from "../middleware/multer.js";
import { createAboutUs, updateAboutUs } from "../controllers/aboutUsController.js";

const router = express.Router();

// Create a new team member with image upload
router.post("/", upload.single("image"), createAboutUs);

// Update a team member with image upload
router.put("/:id", upload.single("image"), updateAboutUs);

export default router;
