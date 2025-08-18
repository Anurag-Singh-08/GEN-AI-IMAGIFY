import express from "express";
import { generateImage, saveImage, getImages } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";

const imageRouter = express.Router();

// Generate a new image
imageRouter.post("/generate-image", userAuth, generateImage);

// Save generated image
imageRouter.post("/save-image", userAuth, saveImage);

// Get all saved images for logged-in user
imageRouter.get("/get-images", userAuth, getImages);

export default imageRouter;
