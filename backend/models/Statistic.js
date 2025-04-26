import mongoose from "mongoose";

const statisticSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: String, required: true },
});

const Statistic = mongoose.model("Statistic", statisticSchema);
export default Statistic;
