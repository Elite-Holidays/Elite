import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  designation: { type: String, required: true },
});

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);
export default AboutUs;
