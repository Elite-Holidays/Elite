import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    overlayImages: {
      type: [String], // Array of image URLs
      required: true,
    },
  },
  { timestamps: true }
);

const HeroSlide = mongoose.model("HeroSlide", HeroSlideSchema);
export default HeroSlide;


