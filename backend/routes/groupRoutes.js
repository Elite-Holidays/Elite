import express from "express";
import upload from "../middleware/multer.js";
import { createGroup, updateGroup } from "../controllers/groupController.js";

const router = express.Router();

// ✅ Create a new group with image upload
router.post("/", upload.single("image"), createGroup);

// ✅ Update a group with image upload
router.put("/:id", upload.single("image"), updateGroup);

export default router;
