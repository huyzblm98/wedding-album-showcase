import { useState, useRef, useEffect } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

interface MusicPlayerProps {
  playlist: { title: string; src: string }[];
}

// Global cache cho audio files - tồn tại suốt vòng đời app
const audioCache = new Map<string, Blob>();
const audioCacheUrls = new Map<string, string>();

// Preload tất cả playlist vào cache
const preloadPlaylist = async (playlist: { title: string; src: string }[]) => {
  const promises = playlist.map(async (track) => {
    // Nếu đã có trong cache, skip
    if (audioCache.has(track.src)) {
      return;
    }

    try {
      const response = await fetch(track.src);
      const blob = await response.blob();
      
      // Lưu blob vào cache
      audioCache.set(track.src, blob);
      
      // Tạo object URL từ blob
      const objectUrl = URL.createObjectURL(blob);
      audioCacheUrls.set(track.src, objectUrl);
      
      console.log(`✅ Cached: ${track.title}`);
    } catch (error) {
      console.error(`❌ Failed to cache: ${track.title}`, error);
    }
  });

  await Promise.all(promises);
};

// Lấy URL từ cache hoặc src gốc
const getAudioUrl = (src: string): string => {
  return audioCacheUrls.get(src) || src;
};

const MusicPlayer = ({ playlist }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCaching, setIsCaching] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasCachedPlaylistRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cache toàn bộ playlist khi component mount
  useEffect(() => {
    if (!hasCachedPlaylistRef.current) {
      hasCachedPlaylistRef.current = true;
      
      preloadPlaylist(playlist).then(() => {
        setIsCaching(false);
        console.log('🎵 Playlist đã được cache!');
      });
    }
  }, [playlist]);

  // Preload tất cả bài còn lại khi bắt đầu phát
  useEffect(() => {
    if (isPlaying && !isCaching) {
      // Background preload các bài chưa cache (nếu có)
      playlist.forEach((track) => {
        if (!audioCache.has(track.src)) {
          fetch(track.src)
            .then(res => res.blob())
            .then(blob => {
              audioCache.set(track.src, blob);
              const objectUrl = URL.createObjectURL(blob);
              audioCacheUrls.set(track.src, objectUrl);
              console.log(`🎵 Background cached: ${track.title}`);
            })
            .catch(err => console.error('Preload error:', err));
        }
      });
    }
  }, [isPlaying, isCaching, playlist]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMainButtonClick = () => {
    // Clear timeout nếu có
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      // Double click - expand
      setIsExpanded(true);
      return;
    }

    // Single click - toggle play/pause
    clickTimeoutRef.current = setTimeout(() => {
      togglePlay();
      clickTimeoutRef.current = null;
    }, 300);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => {
      const nextTrack = (prev + 1) % playlist.length;
      return nextTrack;
    });
    setIsPlaying(true);
    setIsExpanded(false);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => {
      const prevTrack = (prev - 1 + playlist.length) % playlist.length;
      return prevTrack;
    });
    setIsPlaying(true);
    setIsExpanded(false);
  };

  // Hiển thị loading khi đang cache
  if (isCaching) {
    return (
      <div className="fixed top-4 right-4 z-[60]">
        <div className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={getAudioUrl(playlist[currentTrack]?.src)}
        onEnded={handleNext}
        loop={false}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Music Controls - Top Right */}
      <div className="fixed top-4 right-4 z-[60] flex items-center gap-3">
        {/* Previous Button - chỉ hiện khi expanded */}
        {isExpanded && (
          <button
            onClick={handlePrevious}
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 animate-in fade-in zoom-in duration-200"
            title="Bài trước"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Main Play/Pause Button */}
        <button
          onClick={handleMainButtonClick}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 hover:opacity-90 flex items-center justify-center transition-all hover:scale-110"
          title={isExpanded ? "Click 1 lần: Play/Pause" : "Click 1 lần: Play/Pause | Click 2 lần: Hiện controls"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white ml-0.5" />
          )}
        </button>

        {/* Next Button - chỉ hiện khi expanded */}
        {isExpanded && (
          <button
            onClick={handleNext}
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 animate-in fade-in zoom-in duration-200"
            title="Bài tiếp theo"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;