import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const { generateImage } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const image = await generateImage(input);
      if (image) {
        setIsImageLoaded(true);
        setImage(image);
      }
    }
    setLoading(false);
  };

  // --- Save Image ---
  const saveImage = async () => {
    if (!image) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token"); // adjust if you store token differently
      const res = await fetch("http://localhost:4000/api/image/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image, prompt: input }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Image saved!");
        navigate("/gallery"); // redirect to Gallery after saving
      } else {
        alert("❌ Failed to save image: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving image");
    } finally {
      setSaving(false);
    }
  };

  // --- Share Image ---
  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this AI-generated image 🎨",
          text: "Made with Text-to-Image Generator",
          url: image, // works best if it's a hosted URL
        });
      } catch (err) {
        console.error("Share cancelled", err);
      }
    } else {
      const shareUrl = encodeURIComponent(image);
      const twitter = `https://twitter.com/intent/tweet?url=${shareUrl}`;
      const facebook = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      const whatsapp = `https://api.whatsapp.com/send?text=${shareUrl}`;
      window.open(twitter, "_blank"); // fallback: open Twitter
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      <div>
        <div className="relative">
          <img src={image} alt="" className="max-w-sm rounded" />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? "w-full transition-all duration-[10s]" : "w-10"
            }`}
          />
        </div>
        <p className={!loading ? "hidden" : ""}>Loading...</p>
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
          >
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => {
              setIsImageLoaded(false);
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Generate Another
          </p>

          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </a>

          <button
            type="button"
            onClick={saveImage}
            className="bg-green-600 px-10 py-3 rounded-full cursor-pointer"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={shareImage}
            className="bg-blue-600 px-10 py-3 rounded-full cursor-pointer"
          >
            Share
          </button>

          <Link
            to="/gallery"
            className="bg-purple-600 px-10 py-3 rounded-full cursor-pointer text-white"
          >
            View Gallery
          </Link>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
