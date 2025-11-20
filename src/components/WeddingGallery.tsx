import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeddingGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
  onStartSlideshow: () => void;
}

const WeddingGallery = ({ images, onImageClick, onStartSlideshow }: WeddingGalleryProps) => {
  const [visibleImages, setVisibleImages] = useState<boolean[]>(new Array(images.length).fill(false));

  useEffect(() => {
    // Tạo mảng chỉ số ngẫu nhiên
    const indices = images.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Hiển thị ảnh theo thứ tự ngẫu nhiên
    indices.forEach((index, order) => {
      setTimeout(() => {
        setVisibleImages(prev => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, order * 50); // Mỗi ảnh xuất hiện cách nhau 50ms
    });
  }, [images]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-serif mb-4 text-foreground">
          Our Wedding Story
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Every moment, forever cherished
        </p>
        <Button
          onClick={onStartSlideshow}
          size="lg"
          className="bg-gradient-to-r from-[hsl(var(--wedding-rose))] to-[hsl(var(--wedding-gold))] hover:opacity-90 transition-opacity shadow-[var(--shadow-elegant)]"
        >
          <Play className="mr-2 h-5 w-5" />
          Start Slideshow
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card
            key={index}
            className={`overflow-hidden cursor-pointer group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-105 ${
              visibleImages[index] ? 'animate-scale-in' : 'opacity-0'
            }`}
            onClick={() => onImageClick(index)}
          >
            <div className="aspect-square relative">
              <img
                src={image}
                alt={`Wedding photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white font-medium">View Photo</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeddingGallery;
