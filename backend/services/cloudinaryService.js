import { cloudinary } from "../utils/cloudinary.js";

// Upload Single File to Cloudinary
export const uploadFileToCloudinary = async (fileBuffer, mimeType, folder = "travel_images") => {
  return new Promise((resolve, reject) => {
    // Determine resource type based on mimetype
    let resourceType = "image";
    if (mimeType.startsWith("video")) {
      resourceType = "video";
    } else if (mimeType === "application/pdf") {
      resourceType = "raw";
    }
    
    const stream = cloudinary.uploader.upload_stream(
      { 
        resource_type: resourceType,
        folder: folder
      },
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
