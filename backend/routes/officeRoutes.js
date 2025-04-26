import express from "express";
import upload from "../middleware/multer.js";
import { createOffice, updateOffice } from "../controllers/officeController.js";

const router = express.Router();

// ✅ Create a new office with image upload
router.post("/", upload.single("image"), createOffice);

// ✅ Update an office with image upload
router.put("/:id", upload.single("image"), updateOffice);

export default router;
