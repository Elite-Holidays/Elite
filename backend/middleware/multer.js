import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory (no local disk)

const upload = multer({ storage });

export default upload;
