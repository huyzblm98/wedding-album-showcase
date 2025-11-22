import { useState } from "react";
import Slideshow from "@/components/Slideshow";
import MusicPlayerV2 from "@/components/MusicPlayerV2";

const WEDDING_IMAGES = [
  "/images/wedding/photo1.jpg",
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
  "/images/wedding/photo15.jpg",
  "/images/wedding/photo16.jpg",
  "/images/wedding/photo17.jpg",
  "/images/wedding/photo18.jpg",
];

const MUSIC_PLAYLIST = [
  { title: "Playlist", src: "/music/all.mp3" },
];

const Index = () => {
  const [showSlideshow, setShowSlideshow] = useState(true);
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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background/background_damngo.png)' }}>
      {showSlideshow && (
        <Slideshow
          images={WEDDING_IMAGES}
          initialIndex={slideshowIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      {/* <MusicPlayer playlist={MUSIC_PLAYLIST} /> */}
      <MusicPlayerV2 />
    </div>
  );
};

export default Index;