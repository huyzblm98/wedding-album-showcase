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

  // Tính toán vị trí circular (vòng tròn)
  const getCircularPosition = (index: number, current: number, total: number) => {
    let position = index - current;
    // Điều chỉnh để có khoảng cách ngắn nhất (circular)
    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }
    return position;
  };

  const getImageStyle = (position: number) => {
    const distance = Math.abs(position);
    const scale = Math.pow(0.5, distance); // Giảm 1 nửa mỗi bước
    const translateX = position * 40; // Khoảng cách giữa các ảnh
    const translateZ = -distance * 200; // Độ sâu 3D
    const opacity = distance > 2 ? 0 : 1 - distance * 0.3;
    const rotateY = position * 15; // Góc xoay

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - distance,
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 flex items-center justify-center overflow-hidden">
      {/* 3D Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {images.map((image, index) => {
            const position = getCircularPosition(index, currentIndex, images.length);
            // Chỉ render ảnh trong phạm vi visible
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
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
