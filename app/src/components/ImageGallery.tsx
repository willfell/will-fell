import { FC, useEffect, useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  directoryPath: string;
}

const ImageGallery: FC<ImageGalleryProps> = ({ directoryPath }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        // Call our API to get images from the directory
        const response = await fetch(
          `/api/images?directory=${encodeURIComponent(directoryPath)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error("Error loading images:", error);
        // Fallback to using known images if API fails
        const imageCount = 6; // We know there are 6 images
        const imagePaths = Array.from(
          { length: imageCount },
          (_, i) => `${directoryPath}/${i + 1}.jpg`,
        );
        setImages(imagePaths);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [directoryPath]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((imagePath, index) => (
        <div
          key={index}
          className={`masonry-item gallery-item rounded-lg overflow-hidden shadow-md ${
            index % 5 === 0 ? "sm:col-span-2" : ""
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: `translateY(${20 + (index % 3) * 10}px)`,
            opacity: 0,
          }}
        >
          <div className="relative group h-64">
            <Image
              src={imagePath}
              alt={`Gallery Image ${index + 1}`}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-forest-green/0 group-hover:bg-forest-green/30 transition-all duration-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
