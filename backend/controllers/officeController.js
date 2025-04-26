import Office from "../models/Office.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js";

/**
 * @desc Create a new office
 * @route POST /api/offices
 */
export const createOffice = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);

    const newOffice = new Office({
      name,
      image: imageUrl,
    });

    await newOffice.save();
    res.status(201).json(newOffice);
  } catch (error) {
    res.status(500).json({ error: "Failed to create office", details: error.message });
  }
};

/**
 * @desc Update an office
 * @route PUT /api/offices/:id
 */
export const updateOffice = async (req, res) => {
  try {
    const { name } = req.body;
    const office = await Office.findById(req.params.id);

    if (!office) return res.status(404).json({ error: "Office not found" });

    let image = office.image;
    if (req.file) {
      image = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
    }

    office.name = name || office.name;
    office.image = image;

    await office.save();
    res.status(200).json(office);
  } catch (error) {
    res.status(500).json({ error: "Failed to update office" });
  }
};
