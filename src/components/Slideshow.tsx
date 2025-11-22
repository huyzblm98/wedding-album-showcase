import { useState, useEffect } from "react";

interface SlideshowProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const Slideshow = ({ images, initialIndex }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Preload ảnh trước và sau ảnh hiện tại
  useEffect(() => {
    const preloadRange = 3; // Load trước 3 ảnh xung quanh
    const imagesToLoad: number[] = [];
    
    for (let i = -preloadRange; i <= preloadRange; i++) {
      const index = (currentIndex + i + images.length) % images.length;
      imagesToLoad.push(index);
    }

    imagesToLoad.forEach(index => {
      if (!loadedImages.has(index)) {
        const img = new Image();
        img.src = images[index];
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(index));
        };
      }
    });
  }, [currentIndex, images, loadedImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const getCircularPosition = (index: number, current: number, total: number) => {
    let position = index - current;
    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }
    return position;
  };

  const getImageStyle = (position: number) => {
    const distance = Math.abs(position);
    const scale = Math.pow(0.5, distance);
    const translateX = position * 40;
    const translateZ = -distance * 200;
    const opacity = distance > 2 ? 0 : 1 - distance * 0.3;
    const rotateY = position * 15;

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - distance,
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {images.map((image, index) => {
            const position = getCircularPosition(index, currentIndex, images.length);
            if (Math.abs(position) > 2) return null;

            return (
              <div
                key={index}
                className="absolute transition-all duration-700 ease-out"
                style={getImageStyle(position)}
              >
                <img
                  src={image}
                  alt={`Wedding photo ${index + 1}`}
                  className="max-w-[800px] max-h-[800px] object-contain rounded-lg shadow-2xl"
                  loading="lazy"
                  decoding="async"
                  style={{
                    opacity: loadedImages.has(index) ? 1 : 0,
                    transition: 'opacity 0.3s ease-in'
                  }}
                />
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;