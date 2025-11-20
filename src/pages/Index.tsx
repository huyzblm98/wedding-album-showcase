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
  "/images/wedding/17.JPG",
  "/images/wedding/18.JPG",
];

const MUSIC_PLAYLIST = [
  { title: "Bài Này Không Để Đi Diễn", src: "/music/bai_nay_khong_de_di_dien.mp3" },
  { title: "Chỉ Cần Có Nhau", src: "/music/chi_can_co_nhau.mp3" },
  { title: "Em Đồng Ý", src: "/music/em_dong_y.mp3" },
  { title: "Hơn Cả Yêu", src: "/music/hon_ca_yeu.mp3" },
  { title: "Một Đời", src: "/music/mot_doi.mp3" },
  { title: "Ngày Này Người Con Gái Này", src: "/music/nga_nay_nguoi_con_gai_nay.mp3" },
  { title: "Ngày Đầu Tiên", src: "/music/ngay_dau_tien.mp3" },
  { title: "Nơi Này Có Em", src: "/music/noi_nay_co_em.mp3" },
  { title: "Ta Là Của Nhau", src: "/music/ta_la_cua_nhau.mp3" },
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
    <div className="min-h-screen">
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
