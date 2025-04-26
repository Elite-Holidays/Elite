import Group from "../models/Group.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js";

/**
 * @desc Create a new group
 * @route POST /api/groups
 */
export const createGroup = async (req, res) => {
  try {
    const { title, price, days, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);

    const newGroup = new Group({
      title,
      image: imageUrl,
      price,
      days,
      description,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group", details: error.message });
  }
};

/**
 * @desc Update a group
 * @route PUT /api/groups/:id
 */
export const updateGroup = async (req, res) => {
  try {
    const { title, price, days, description } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: "Group not found" });

    let image = group.image;
    if (req.file) {
      image = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
    }

    group.title = title || group.title;
    group.image = image;
    group.price = price || group.price;
    group.days = days || group.days;
    group.description = description || group.description;

    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to update group" });
  }
};
