import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  days: { type: String, required: true },
  description: { type: String, required: true },
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
