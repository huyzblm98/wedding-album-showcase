import { useState, useEffect, useCallback } from "react";

interface SlideshowProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

// Cache ảnh với memory management
const imageCache = new Map<string, HTMLImageElement>();
const CACHE_LIMIT = 20; // Giới hạn cache để tránh memory leak

const addToCache = (src: string, img: HTMLImageElement) => {
  if (imageCache.size >= CACHE_LIMIT) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
  imageCache.set(src, img);
};

const Slideshow = ({ images, initialIndex }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Preload ảnh với tối ưu hóa cho TV
  useEffect(() => {
    let mounted = true;
    let animationFrameId: number;

    const loadImagesOptimized = async () => {
      if (!mounted) return;

      const total = images.length;
      let loadedCount = 0;

      const updateProgress = () => {
        if (!mounted) return;
        setLoadProgress((loadedCount / total) * 100);
      };

      // Load ảnh hiện tại và 2 ảnh kế tiếp trước
      const priorityIndices = [
        currentIndex,
        (currentIndex + 1) % total,
        (currentIndex + 2) % total,
        (currentIndex - 1 + total) % total,
        (currentIndex - 2 + total) % total,
      ];

      // Load ảnh ưu tiên trước
      for (const index of priorityIndices) {
        if (!mounted) break;
        
        const src = images[index];
        if (loadedImages.has(src) || imageCache.has(src)) {
          loadedCount++;
          updateProgress();
          continue;
        }

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (mounted) {
              addToCache(src, img);
              setLoadedImages(prev => new Set(prev).add(src));
              loadedCount++;
              updateProgress();
            }
            resolve();
          };
          img.onerror = () => {
            if (mounted) {
              loadedCount++;
              updateProgress();
            }
            resolve();
          };
          img.src = src;
        });

        // Thêm delay nhỏ để tránh block UI
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Load các ảnh còn lại trong background
      if (mounted) {
        for (let i = 0; i < total; i++) {
          if (!mounted) break;
          
          const src = images[i];
          if (loadedImages.has(src) || imageCache.has(src)) continue;

          const img = new Image();
          img.onload = () => {
            if (mounted) {
              addToCache(src, img);
              setLoadedImages(prev => new Set(prev).add(src));
            }
          };
          img.src = src;
        }
      }

      if (mounted && loadedCount > 0) {
        setIsLoading(false);
      }
    };

    loadImagesOptimized();

    return () => {
      mounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [images, currentIndex]);

  // Slideshow auto-play với requestAnimationFrame
  useEffect(() => {
    if (isLoading) return;

    let mounted = true;
    let lastTime = 0;
    const interval = 4000; // 4 seconds

    const animate = (time: number) => {
      if (!mounted) return;

      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (delta >= interval) {
        setCurrentIndex(prev => (prev + 1) % images.length);
        lastTime = time;
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      cancelAnimationFrame(animationId);
    };
  }, [images.length, isLoading]);

  // Memoize các hàm tính toán để tránh re-render không cần thiết
  const getCircularPosition = useCallback((index: number, current: number, total: number) => {
    let position = index - current;
    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }
    return position;
  }, []);

  const getImageStyle = useCallback((position: number) => {
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
  }, []);

  // Preload ảnh tiếp theo khi currentIndex thay đổi
  useEffect(() => {
    if (isLoading) return;

    const nextIndex = (currentIndex + 1) % images.length;
    const nextSrc = images[nextIndex];

    if (!loadedImages.has(nextSrc) && !imageCache.has(nextSrc)) {
      const img = new Image();
      img.onload = () => addToCache(nextSrc, img);
      img.src = nextSrc;
    }
  }, [currentIndex, images, isLoading, loadedImages]);

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
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {images.map((image, index) => {
            const position = getCircularPosition(index, currentIndex, images.length);
            if (Math.abs(position) > 2) return null;

            return (
              <div
                key={`${image}-${index}`}
                className="absolute transition-all duration-700 ease-out"
                style={getImageStyle(position)}
              >
                <img
                  src={image}
                  alt={`Wedding photo ${index + 1}`}
                  className="max-w-[800px] max-h-[800px] object-contain rounded-lg shadow-2xl"
                  loading="eager"
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