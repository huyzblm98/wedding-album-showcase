import { useState } from "react";
import WeddingGallery from "@/components/WeddingGallery";
import Slideshow from "@/components/Slideshow";
import MusicPlayer from "@/components/MusicPlayer";

const WEDDING_IMAGES = [
  "/images/wedding/5D4_0007.JPG",
  "/images/wedding/5D4_0009.JPG",
  "/images/wedding/5D4_0018.JPG",
  "/images/wedding/5D4_0020.JPG",
  "/images/wedding/5D4_0022.JPG",
  "/images/wedding/5D4_0024.JPG",
  "/images/wedding/5D4_0027.JPG",
  "/images/wedding/5D4_0028.JPG",
  "/images/wedding/5D4_0030.JPG",
  "/images/wedding/5D4_0055.JPG",
  "/images/wedding/5D4_0056.JPG",
  "/images/wedding/5D4_0058.JPG",
  "/images/wedding/5D4_0060.JPG",
  "/images/wedding/5D4_0062.JPG",
  "/images/wedding/5D4_0064.JPG",
  "/images/wedding/5D4_0076.JPG",
  "/images/wedding/5D4_0081.JPG",
  "/images/wedding/5D4_0085.JPG",
  "/images/wedding/5D4_0101.JPG",
  "/images/wedding/5D4_0104.JPG",
  "/images/wedding/5D4_0116.JPG",
  "/images/wedding/5D4_0125.JPG",
  "/images/wedding/5D4_0128.JPG",
  "/images/wedding/5D4_0132.JPG",
  "/images/wedding/5D4_0143.JPG",
  "/images/wedding/5D4_0145.JPG",
  "/images/wedding/5D4_0185.JPG",
  "/images/wedding/5D4_0187.JPG",
  "/images/wedding/5D4_0192.JPG",
  "/images/wedding/5D4_0195.JPG",
  "/images/wedding/5D4_0197.JPG",
  "/images/wedding/5D4_0206.JPG",
  "/images/wedding/5D4_0208.JPG",
  "/images/wedding/5D4_0210.JPG",
  "/images/wedding/5D4_0223.JPG",
  "/images/wedding/5D4_0238.JPG",
  "/images/wedding/5D4_9520.JPG",
  "/images/wedding/5D4_9523.JPG",
  "/images/wedding/5D4_9525.JPG",
  "/images/wedding/5D4_9538.JPG",
  "/images/wedding/5D4_9540.JPG",
  "/images/wedding/5D4_9542.JPG",
  "/images/wedding/5D4_9544.JPG",
  "/images/wedding/5D4_9550.JPG",
  "/images/wedding/5D4_9596.JPG",
  "/images/wedding/5D4_9600.JPG",
  "/images/wedding/5D4_9602.JPG",
  "/images/wedding/5D4_9604.JPG",
  "/images/wedding/5D4_9605.JPG",
  "/images/wedding/5D4_9609.JPG",
  "/images/wedding/5D4_9612.JPG",
  "/images/wedding/5D4_9618.JPG",
  "/images/wedding/5D4_9622.JPG",
  "/images/wedding/5D4_9641.JPG",
  "/images/wedding/5D4_9643.JPG",
  "/images/wedding/5D4_9645.JPG",
  "/images/wedding/5D4_9647.JPG",
  "/images/wedding/5D4_9649.JPG",
  "/images/wedding/5D4_9651.JPG",
  "/images/wedding/5D4_9662.JPG",
  "/images/wedding/5D4_9664.JPG",
  "/images/wedding/5D4_9667.JPG",
  "/images/wedding/5D4_9688.JPG",
  "/images/wedding/5D4_9690.JPG",
  "/images/wedding/5D4_9710.JPG",
  "/images/wedding/5D4_9712.JPG",
  "/images/wedding/5D4_9714.JPG",
  "/images/wedding/5D4_9716.JPG",
  "/images/wedding/5D4_9719.JPG",
  "/images/wedding/5D4_9722.JPG",
  "/images/wedding/5D4_9729.JPG",
  "/images/wedding/5D4_9753.JPG",
  "/images/wedding/5D4_9755.JPG",
  "/images/wedding/5D4_9758.JPG",
  "/images/wedding/5D4_9761.JPG",
  "/images/wedding/5D4_9763.JPG",
  "/images/wedding/5D4_9766.JPG",
  "/images/wedding/5D4_9784.JPG",
  "/images/wedding/5D4_9786.JPG",
  "/images/wedding/5D4_9802.JPG",
  "/images/wedding/5D4_9814.JPG",
  "/images/wedding/5D4_9815.JPG",
  "/images/wedding/5D4_9819.JPG",
  "/images/wedding/5D4_9821.JPG",
  "/images/wedding/5D4_9834.JPG",
  "/images/wedding/5D4_9835.JPG",
  "/images/wedding/5D4_9837.JPG",
  "/images/wedding/5D4_9841.JPG",
  "/images/wedding/5D4_9843.JPG",
  "/images/wedding/5D4_9885.JPG",
  "/images/wedding/5D4_9887.JPG",
  "/images/wedding/5D4_9891.JPG",
  "/images/wedding/5D4_9895.JPG",
  "/images/wedding/5D4_9897.JPG",
  "/images/wedding/5D4_9908.JPG",
  "/images/wedding/5D4_9911.JPG",
  "/images/wedding/5D4_9919.JPG",
  "/images/wedding/5D4_9925.JPG",
  "/images/wedding/5D4_9959.JPG",
  "/images/wedding/5D4_9968.JPG",
  "/images/wedding/5D4_9970.JPG",
  "/images/wedding/5D4_9974.JPG",
  "/images/wedding/5D4_9976.JPG",
  "/images/wedding/5D4_9991.JPG",
  "/images/wedding/5D4_9994.JPG",
  "/images/wedding/5D4_9997.JPG",
  "/images/wedding/HN_02442.JPG",
  "/images/wedding/HN_02447.JPG",
  "/images/wedding/HN_02461.JPG",
  "/images/wedding/HN_02465.JPG",
  "/images/wedding/HN_02467.JPG",
  "/images/wedding/HN_02469.JPG",
  "/images/wedding/HN_02473.JPG",
  "/images/wedding/HN_02475.JPG",
  "/images/wedding/HN_02478.JPG",
  "/images/wedding/HN_02508.JPG",
  "/images/wedding/HN_02510.JPG",
  "/images/wedding/HN_02515.JPG",
  "/images/wedding/HN_02517.JPG",
  "/images/wedding/HN_02521.JPG",
  "/images/wedding/HN_02535.JPG",
  "/images/wedding/HN_02555.JPG",
  "/images/wedding/HN_02561.JPG",
  "/images/wedding/HN_02563.JPG",
  "/images/wedding/HN_02566.JPG",
  "/images/wedding/HN_02577.JPG",
  "/images/wedding/HN_02581.JPG",
  "/images/wedding/HN_02583.JPG",
  "/images/wedding/HN_02586.JPG",
  "/images/wedding/HN_02590.JPG",
  "/images/wedding/HN_02623.JPG",
  "/images/wedding/HN_02625.JPG",
  "/images/wedding/HN_02628.JPG",
  "/images/wedding/HN_02631.JPG",
  "/images/wedding/HN_02633.JPG",
  "/images/wedding/HN_02637.JPG",
  "/images/wedding/HN_02640.JPG",
  "/images/wedding/HN_02643.JPG",
  "/images/wedding/HN_02647.JPG",
  "/images/wedding/HN_02680.JPG",
  "/images/wedding/HN_02683.JPG",
  "/images/wedding/HN_02686.JPG",
  "/images/wedding/HN_02688.JPG",
  "/images/wedding/HN_02690.JPG",
  "/images/wedding/HN_02693.JPG",
  "/images/wedding/HN_02709.JPG",
  "/images/wedding/HN_02713.JPG",
  "/images/wedding/HN_02717.JPG",
  "/images/wedding/HN_02732.JPG",
  "/images/wedding/HN_02735.JPG",
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
