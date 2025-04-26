import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const Office = mongoose.model("Office", officeSchema);
export default Office;
