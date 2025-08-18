import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";
import Image from "../models/imageModel.js";   // ⬅️ new model for images

// ------------------- Generate Image -------------------
export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    if (user.creditBalance === 0 || user.creditBalance < 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64, ${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Save Image -------------------
export const saveImage = async (req, res) => {
  try {
    const { image, prompt } = req.body;
    const userId = req.user.id; // comes from auth middleware

    if (!image) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newImage = new Image({ image, prompt, userId });
    await newImage.save();

    res.status(201).json({
      success: true,
      message: "Image saved successfully",
      id: newImage._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- Get Saved Images -------------------
export const getImages = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
