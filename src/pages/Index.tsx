import { useState, useEffect } from "react";
import Slideshow from "@/components/Slideshow";
import MusicPlayerV2 from "@/components/MusicPlayerV2";

const WEDDING_IMAGES = [
  "/images/wedding/photo1.jpg",
  "/images/wedding/photo15.jpg",
  "/images/wedding/photo16.jpg",
  "/images/wedding/photo2.jpg",
  "/images/wedding/photo3.jpg",
  "/images/wedding/photo4.jpg",
  "/images/wedding/photo5.jpg",
  "/images/wedding/photo6.jpg",
  "/images/wedding/photo7.jpg",
  "/images/wedding/photo8.jpg",
  "/images/wedding/photo9.jpg",
  "/images/wedding/photo10.jpg",
  "/images/wedding/photo11.jpg",
  "/images/wedding/photo12.jpg",
  "/images/wedding/photo13.jpg",
  "/images/wedding/photo14.jpg",
];

const MUSIC_FILE = "/music/all.mp3";

const Index = () => {
  const [showSlideshow, setShowSlideshow] = useState(true);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = WEDDING_IMAGES.length + 1; // ảnh + nhạc

    const updateProgress = () => {
      loadedCount++;
      setLoadProgress((loadedCount / totalAssets) * 100);
    };

    // Preload tất cả ảnh
    const imagePromises = WEDDING_IMAGES.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          updateProgress();
          resolve();
        };
        img.src = src;
      });
    });

    // Preload nhạc
    const musicPromise = new Promise<void>((resolve) => {
      const audio = new Audio(MUSIC_FILE);
      audio.preload = 'auto';
      
      // Khi nhạc đã load đủ để phát
      audio.addEventListener('canplaythrough', () => {
        updateProgress();
        resolve();
      }, { once: true });

      audio.addEventListener('error', () => {
        console.warn('Failed to load music');
        updateProgress();
        resolve();
      }, { once: true });

      audio.load();
    });

    // Đợi tất cả assets load xong
    Promise.all([...imagePromises, musicPromise]).then(() => {
      setIsLoading(false);
      setAssetsReady(true);
    });
  }, []);

  const handleImageClick = (index: number) => {
    setSlideshowIndex(index);
    setShowSlideshow(true);
  };

  const handleStartSlideshow = () => {
    setSlideshowIndex(0);
    setShowSlideshow(true);
  };

  // Hiển thị loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium mb-2">Đang chuẩn bị...</p>
          <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 transition-all duration-300 rounded-full"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600 text-sm mt-2">{Math.round(loadProgress)}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background/background_damngo.png)' }}>
      {showSlideshow && (
        <Slideshow
          images={WEDDING_IMAGES}
          initialIndex={slideshowIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      {/* Chỉ render MusicPlayerV2 khi assets đã sẵn sàng */}
      {assetsReady && <MusicPlayerV2 />}
    </div>
  );
};

export default Index;