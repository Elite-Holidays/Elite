import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
