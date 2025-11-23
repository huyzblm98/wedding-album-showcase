import { useState, useEffect, useCallback } from "react";

interface SlideshowProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const imageCache = new Map();
const CACHE_LIMIT = 20;

const addToCache = (src, img) => {
  if (imageCache.size >= CACHE_LIMIT) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
  imageCache.set(src, img);
};

const Slideshow = ({ images, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [use3D, setUse3D] = useState(true);

  // Detect 3D transform support
  useEffect(() => {
    const testEl = document.createElement('div');
    const has3D = (
      'WebkitPerspective' in testEl.style ||
      'MozPerspective' in testEl.style ||
      'perspective' in testEl.style
    );
    setUse3D(has3D);
    console.log('3D Support:', has3D);
  }, []);

  // Preload images
  useEffect(() => {
    let mounted = true;

    const loadImagesOptimized = async () => {
      if (!mounted) return;

      const total = images.length;
      let loadedCount = 0;

      const updateProgress = () => {
        if (!mounted) return;
        setLoadProgress((loadedCount / total) * 100);
      };

      const priorityIndices = [
        currentIndex,
        (currentIndex + 1) % total,
        (currentIndex + 2) % total,
        (currentIndex - 1 + total) % total,
        (currentIndex - 2 + total) % total,
      ];

      for (const index of priorityIndices) {
        if (!mounted) break;
        
        const src = images[index];
        if (loadedImages.has(src) || imageCache.has(src)) {
          loadedCount++;
          updateProgress();
          continue;
        }

        await new Promise((resolve) => {
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

        await new Promise(resolve => setTimeout(resolve, 50));
      }

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
    };
  }, [images, currentIndex, loadedImages]);

  // Auto-play slideshow
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isLoading]);

  const getCircularPosition = useCallback((index, current, total) => {
    let position = index - current;
    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }
    return position;
  }, []);

  // 3D style with vendor prefixes
  const get3DImageStyle = useCallback((position) => {
    const distance = Math.abs(position);
    const scale = Math.pow(0.6, distance);
    const translateX = position * 50;
    const translateZ = -distance * 300;
    const opacity = distance > 2 ? 0 : 1 - distance * 0.25;
    const rotateY = position * 12;

    const transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

    return {
      transform: transform,
      WebkitTransform: transform,
      MozTransform: transform,
      msTransform: transform,
      OTransform: transform,
      opacity,
      zIndex: 10 - distance,
    };
  }, []);

  // 2D fallback style
  const get2DImageStyle = useCallback((position) => {
    const distance = Math.abs(position);
    
    if (position === 0) {
      return {
        transform: 'translateX(-50%) scale(1)',
        WebkitTransform: 'translateX(-50%) scale(1)',
        left: '50%',
        opacity: 1,
        zIndex: 10,
      };
    }
    
    const scale = Math.pow(0.7, distance);
    const translateX = position * 30;
    const opacity = distance > 2 ? 0 : 1 - distance * 0.35;
    
    const transform = `translateX(${translateX}%) scale(${scale})`;

    return {
      transform: transform,
      WebkitTransform: transform,
      MozTransform: transform,
      msTransform: transform,
      OTransform: transform,
      left: position < 0 ? '20%' : '80%',
      opacity,
      zIndex: 10 - distance,
    };
  }, []);

  // Preload next image
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

  const containerStyle = use3D ? {
    perspective: '2500px',
    WebkitPerspective: '2500px',
    MozPerspective: '2500px',
  } : {};

  const innerStyle = use3D ? {
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
    MozTransformStyle: 'preserve-3d',
  } : {};

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-full h-full flex items-center justify-center" 
        style={containerStyle}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center" 
          style={innerStyle}
        >
          {images.map((image, index) => {
            const position = getCircularPosition(index, currentIndex, images.length);
            if (Math.abs(position) > 2) return null;

            const imageStyle = use3D ? get3DImageStyle(position) : get2DImageStyle(position);

            return (
              <div
                key={`${image}-${index}`}
                className="absolute transition-all duration-700 ease-out"
                style={imageStyle}
              >
                <img
                  src={image}
                  alt={`Wedding photo ${index + 1}`}
                  className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  style={{ 
                    imageRendering: 'high-quality',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  loading="eager"
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {!use3D && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-500/80 text-white px-4 py-2 rounded-lg text-sm">
          Chế độ tương thích 2D (TV không hỗ trợ 3D)
        </div>
      )}
    </div>
  );
};

export default Slideshow;