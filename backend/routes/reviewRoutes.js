import express from "express";
import upload from "../middleware/multer.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createReview, updateReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

// ✅ Create a new review with image upload (protected route - requires authentication)
router.post("/", requireAuth, upload.single("image"), createReview);

// ✅ Update a review with image upload (protected route - requires authentication)
router.put("/:id", requireAuth, upload.single("image"), updateReview);

// ✅ Fetch all reviews
router.get("/", getReviews);

export default router;
