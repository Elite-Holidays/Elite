import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
