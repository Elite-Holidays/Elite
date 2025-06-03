import Review from "../models/Review.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js";

/**
 * @desc Create a new review
 * @route POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    const { name, location, rating, comment, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);

    const newReview = new Review({
      name,
      location,
      rating,
      comment,
      image: imageUrl,
      date,
      userId: req.user.id,
      userEmail: req.user.email_addresses?.[0]?.email_address || '',
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to create review", details: error.message });
  }
};

/**
 * @desc Update a review
 * @route PUT /api/reviews/:id
 */
export const updateReview = async (req, res) => {
  try {
    const { name, location, rating, comment, date } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ error: "Review not found" });
    
    // Check if the user is the owner of the review
    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this review" });
    }

    let image = review.image;
    if (req.file) {
      image = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
    }

    review.name = name || review.name;
    review.location = location || review.location;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.image = image;
    review.date = date || review.date;

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch all reviews from MongoDB
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};
