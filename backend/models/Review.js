import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'] 
  },
  rating: { 
    type: Number, 
    required: [true, 'Rating is required'],
    min: 1,
    max: 5 
  },
  comment: { 
    type: String, 
    required: [true, 'Comment is required'] 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  // Optional user reference if logged in
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;