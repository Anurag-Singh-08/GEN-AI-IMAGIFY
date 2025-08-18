import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token"); // adjust if token is stored differently
        const res = await fetch("http://localhost:4000/api/image/get-images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (err) {
        console.error("Error fetching saved images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p className="text-center">Loading gallery...</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">My Saved Images</h1>

      {images.length === 0 ? (
        <p>No saved images yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="rounded-xl shadow-md overflow-hidden bg-white"
            >
              <img
                src={img.image}
                alt="AI generated"
                className="w-full object-cover"
              />
              <div className="p-3 text-sm text-gray-700">
                <p>
                  <strong>Prompt:</strong> {img.prompt}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(img.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
