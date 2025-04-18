import mongoose from "mongoose";

const atmSchema = new mongoose.Schema({
  availableCash: {
    type: Number,
    required: true,
    default: 100000, // Or set initial in seed
  },
});

const ATM = mongoose.model("atms", atmSchema);
export default ATM;
