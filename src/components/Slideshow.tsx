import { useState, useEffect } from "react";

interface SlideshowProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const Slideshow = ({ images, initialIndex }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[hsl(var(--wedding-rose))]/20 via-black to-[hsl(var(--wedding-gold))]/20 flex items-center justify-center">
      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Wedding photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain animate-fadeZoom"
        />
      </div>
    </div>
  );
};

export default Slideshow;
