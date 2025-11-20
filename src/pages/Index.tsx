import { useState } from "react";
import WeddingGallery from "@/components/WeddingGallery";
import Slideshow from "@/components/Slideshow";
import MusicPlayer from "@/components/MusicPlayer";

// TODO: Thêm ảnh của bạn vào thư mục public/images/wedding/
// Ví dụ: public/images/wedding/photo1.jpg, photo2.jpg, etc.
const WEDDING_IMAGES = [
  "/images/wedding/photo1.jpg",
  "/images/wedding/photo2.jpg",
  "/images/wedding/photo3.jpg",
  // Thêm đường dẫn ảnh của bạn ở đây (tổng cộng ~100 ảnh)
];

// TODO: Thêm nhạc của bạn vào thư mục public/music/
// Ví dụ: public/music/song1.mp3, song2.mp3, etc.
const MUSIC_PLAYLIST = [
  { title: "First Dance", src: "/music/song1.mp3" },
  { title: "Romantic Melody", src: "/music/song2.mp3" },
  { title: "Our Song", src: "/music/song3.mp3" },
  // Thêm các bài nhạc của bạn ở đây (tổng cộng ~10 bài)
];

const Index = () => {
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSlideshowIndex(index);
    setShowSlideshow(true);
  };

  const handleStartSlideshow = () => {
    setSlideshowIndex(0);
    setShowSlideshow(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--wedding-blush))] to-[hsl(var(--background))]">
      <WeddingGallery
        images={WEDDING_IMAGES}
        onImageClick={handleImageClick}
        onStartSlideshow={handleStartSlideshow}
      />

      {showSlideshow && (
        <Slideshow
          images={WEDDING_IMAGES}
          initialIndex={slideshowIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      <MusicPlayer playlist={MUSIC_PLAYLIST} />
    </div>
  );
};

export default Index;
