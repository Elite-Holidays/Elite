import AboutUs from "../models/AboutUs.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js";

/**
 * @desc Create a new team member
 * @route POST /api/about-us
 */
export const createAboutUs = async (req, res) => {
  try {
    const { name, designation } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);

    const newMember = new AboutUs({
      name,
      image: imageUrl,
      designation,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team member", details: error.message });
  }
};

/**
 * @desc Update a team member
 * @route PUT /api/about-us/:id
 */
export const updateAboutUs = async (req, res) => {
  try {
    const { name, designation } = req.body;
    const member = await AboutUs.findById(req.params.id);

    if (!member) return res.status(404).json({ error: "Team member not found" });

    let image = member.image;
    if (req.file) {
      image = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
    }

    member.name = name || member.name;
    member.image = image;
    member.designation = designation || member.designation;

    await member.save();
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team member" });
  }
};
