import express from "express";
import upload from "../middleware/multer.js";
import { createReview, updateReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

// ✅ Create a new review with image upload
router.post("/", upload.single("image"), createReview);

// ✅ Update a review with image upload
router.put("/:id", upload.single("image"), updateReview);

// ✅ Fetch all reviews
router.get("/", getReviews);

export default router;
