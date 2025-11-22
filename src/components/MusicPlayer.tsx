import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  playlist: { title: string; src: string }[];
}

const MusicPlayer = ({ playlist }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPreloadedRef = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
    // Reset preload flag khi chuyển bài
    hasPreloadedRef.current = false;
  }, [isPlaying, currentTrack]);

  // Preload bài tiếp theo khi đạt 75%
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const progress = audio.currentTime / audio.duration;
      
      // Khi đạt 75% và chưa preload
      if (progress >= 0.75 && !hasPreloadedRef.current) {
        hasPreloadedRef.current = true;
        
        // Tính bài tiếp theo
        const nextTrackIndex = (currentTrack + 1) % playlist.length;
        const nextTrackSrc = playlist[nextTrackIndex]?.src;
        
        if (nextTrackSrc) {
          // Tạo Audio object mới để preload
          preloadAudioRef.current = new Audio(nextTrackSrc);
          preloadAudioRef.current.preload = 'auto';
          preloadAudioRef.current.load();
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      // Cleanup preload audio nếu có
      if (preloadAudioRef.current) {
        preloadAudioRef.current.pause();
        preloadAudioRef.current = null;
      }
    };
  }, [currentTrack, playlist]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => {
      const nextTrack = (prev + 1) % playlist.length;
      return nextTrack;
    });
    setIsPlaying(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={playlist[currentTrack]?.src}
        onEnded={handleNext}
        loop={false}
      />

      <Button
        onClick={togglePlay}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-[var(--shadow-elegant)] bg-gradient-to-br from-[hsl(var(--wedding-rose))] to-[hsl(var(--wedding-gold))] hover:opacity-90 z-[60] animate-float"
      >
        {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
      </Button>
    </>
  );
};

export default MusicPlayer;
