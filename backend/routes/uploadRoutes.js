import express from "express";
import upload from "../middlewares/multer.js";
import { uploadFiles } from "../controllers/uploadController.js";

const router = express.Router();

// Upload Multiple Images/Videos
router.post("/upload", upload.array("files", 10), uploadFiles); // Max 10 files

export default router;
