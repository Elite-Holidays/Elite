import { cloudinary } from "../utils/cloudinary.js";

// Upload Single File to Cloudinary
export const uploadFileToCloudinary = async (fileBuffer, mimeType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: mimeType.startsWith("video") ? "video" : "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Upload Multiple Files
export const uploadMultipleFilesToCloudinary = async (files) => {
  return Promise.all(
    files.map(file => uploadFileToCloudinary(file.buffer, file.mimetype))
  );
};
