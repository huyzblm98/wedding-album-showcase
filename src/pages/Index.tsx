import { useState } from "react";
import WeddingGallery from "@/components/WeddingGallery";
import Slideshow from "@/components/Slideshow";
import MusicPlayer from "@/components/MusicPlayer";

const WEDDING_IMAGES = [
  "/images/wedding/1.JPG",
  "/images/wedding/2.JPG",
  "/images/wedding/3.JPG",
  "/images/wedding/4.jpg",
  "/images/wedding/5.JPG",
  "/images/wedding/6.jpg",
  "/images/wedding/7.JPG",
  "/images/wedding/8.JPG",
  "/images/wedding/9.jpg",
  "/images/wedding/10.JPG",
  "/images/wedding/11.JPG",
  "/images/wedding/12.JPG",
  "/images/wedding/13.jpg",
  "/images/wedding/14.jpg",
  "/images/wedding/15.jpg",
  "/images/wedding/16.JPG",
  "/images/wedding/17.JPG"
];

const MUSIC_PLAYLIST = [
  { title: "Bài Này Không Để Đi Diễn", src: "/music/1.mp3" },
  { title: "Beautiful In White", src: "/music/2.mp3" },
  { title: "Chỉ Cần Có Nhau", src: "/music/3.mp3" },
  { title: "Cưới Thôi", src: "/music/4.mp3" },
  { title: "Oah", src: "/music/16.mp3" },
  { title: "Em Đồng Ý", src: "/music/5.mp3" },
  { title: "Hơn Cả Yêu", src: "/music/6.mp3" },
  { title: "Lễ Đường", src: "/music/7.mp3" },
  { title: "Một Đời", src: "/music/8.mp3" },
  { title: "My Love", src: "/music/9.mp3" },
  { title: "Ngày Này Người Con Gái Này", src: "/music/10.mp3" },
  { title: "Ngày Đầu Tiên", src: "/music/11.mp3" },
  { title: "Nơi Này Có Anh", src: "/music/12.mp3" },
  { title: "Sugar", src: "/music/13.mp3" },
  { title: "Ta Là Của Nhau", src: "/music/14.mp3" },
  { title: "Until You", src: "/music/15.mp3" },
  //{ title: "Playlist", src: "/music/all.mp3" },
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center animate-[ken-burns_30s_ease-in-out_infinite]"
        style={{ backgroundImage: 'url(/images/background/background_damngo.png)' }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      {/* Content */}
      <div className="relative z-10">
        {showSlideshow && (
          <Slideshow
            images={WEDDING_IMAGES}
            initialIndex={slideshowIndex}
            onClose={() => setShowSlideshow(false)}
          />
        )}

        <MusicPlayer playlist={MUSIC_PLAYLIST} />
      </div>
    </div>
  );
};

export default Index;
