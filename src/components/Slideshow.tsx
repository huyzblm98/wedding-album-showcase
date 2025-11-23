import { useState, useEffect, useMemo } from "react";

interface SlideshowProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

// Cache ảnh ở ngoài component để giữ lại giữa các lần render
const imageCache = new Map<string, HTMLImageElement>();
let isPreloading = false;
let preloadPromise: Promise<void> | null = null;

const preloadAllImages = (images: string[]): Promise<void> => {
  // Nếu đang preload hoặc đã preload xong, return promise hiện tại
  if (preloadPromise) return preloadPromise;
  
  if (isPreloading) return Promise.resolve();
  
  isPreloading = true;
  
  preloadPromise = Promise.all(
    images.map(src => {
      // Nếu ảnh đã có trong cache, skip
      if (imageCache.has(src)) {
        return Promise.resolve();
      }
      
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageCache.set(src, img);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          resolve(); // Vẫn resolve để không block các ảnh khác
        };
        img.src = src;
      });
    })
  ).then(() => {
    isPreloading = false;
  });
  
  return preloadPromise;
};

const Slideshow = ({ images, initialIndex }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Tạo trái tim với useMemo để tránh re-render không cần thiết
  const hearts = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 20 + Math.random() * 20,
    }));
  }, []);

  // Preload tất cả ảnh khi component mount
  useEffect(() => {
    let loadedCount = 0;
    
    const loadWithProgress = async () => {
      await Promise.all(
        images.map(src => {
          if (imageCache.has(src)) {
            loadedCount++;
            setLoadProgress((loadedCount / images.length) * 100);
            return Promise.resolve();
          }
          
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              imageCache.set(src, img);
              loadedCount++;
              setLoadProgress((loadedCount / images.length) * 100);
              resolve();
            };
            img.onerror = () => {
              loadedCount++;
              setLoadProgress((loadedCount / images.length) * 100);
              resolve();
            };
            img.src = src;
          });
        })
      );
      
      setIsLoading(false);
    };
    
    loadWithProgress();
  }, [images]);

  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isLoading]);

  // Tối ưu cho Smart TV: giảm số lượng phần tử hiển thị
  const getCircularPosition = (index: number, current: number, total: number) => {
    let position = index - current;
    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }
    return position;
  };

  // Tối ưu: sử dụng transform thay vì nhiều thuộc tính
  const getImageStyle = (position: number) => {
    const distance = Math.abs(position);
    const scale = position === 0 ? 1 : (distance === 1 ? 0.75 : 0.6); // Ảnh giữa to nhất, xa dần nhỏ dần
    const translateX = position * 45; // Khoảng cách vừa phải
    const translateZ = position === 0 ? 0 : (distance === 1 ? -250 : -400); // Ảnh xa lùi sâu hơn
    const opacity = distance > 2 ? 0 : (distance === 2 ? 0.6 : 1); // Ảnh xa nhất mờ hơn
    const rotateY = position * 30; // Xoay vừa phải

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - distance,
      willChange: 'transform, opacity', // Tối ưu GPU
    };
  };

  // Hiển thị loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Đang tải ảnh...</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
            <div 
              className="bg-pink-500 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600 text-sm mt-2">{Math.round(loadProgress)}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 flex items-center justify-center overflow-hidden">
      {/* Trái tim bay */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            animation: 'floatUp linear infinite',
            willChange: 'transform', // Tối ưu GPU
          }}
        >
          <div
            className="text-red-500"
            style={{
              fontSize: `${heart.size}px`,
              opacity: 0.7,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          >
            ❤️
          </div>
        </div>
      ))}

      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {images.map((image, index) => {
            const position = getCircularPosition(index, currentIndex, images.length);
            if (Math.abs(position) > 2) return null; // Hiện 5 ảnh: 1 giữa + 2 bên trái + 2 bên phải

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
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Animation cho trái tim */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: 0.8;
          }
          95% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20vh) translateX(${Math.random() > 0.5 ? '' : '-'}${30 + Math.random() * 40}px) rotate(${Math.random() * 360}deg) scale(1);
            opacity: 0;
          }
        }
        
        /* Tối ưu cho Smart TV */
        * {
          -webkit-transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
        }
      `}</style>
    </div>
  );
};

export default Slideshow;