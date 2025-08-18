import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  image: { type: String, required: true },   // image URL or base64
    prompt: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Image", imageSchema);
