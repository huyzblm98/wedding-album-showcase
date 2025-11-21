import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface MusicPlayerProps {
  playlist: { title: string; src: string }[];
}

const MusicPlayer = ({ playlist }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = false; // Đảm bảo không loop từng bài
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay bị chặn, chờ user tương tác
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Tự động phát nhạc khi component mount
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => {
      const nextTrack = (prev + 1) % playlist.length;
      return nextTrack;
    });
    setIsPlaying(true); // Đảm bảo tiếp tục phát
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={playlist[currentTrack]?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        loop={false}
      />

      {isExpanded ? (
        <Card className="fixed bottom-4 right-4 p-4 w-80 shadow-[var(--shadow-elegant)] bg-card/95 backdrop-blur-sm z-[60] animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[hsl(var(--wedding-rose))] to-[hsl(var(--wedding-gold))] flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{playlist[currentTrack]?.title}</h3>
              <p className="text-xs text-muted-foreground">
                Track {currentTrack + 1} of {playlist.length}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
              <Music className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handlePrevious}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                className="bg-gradient-to-r from-[hsl(var(--wedding-rose))] to-[hsl(var(--wedding-gold))] hover:opacity-90"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="w-20"
              />
            </div>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-[var(--shadow-elegant)] bg-gradient-to-br from-[hsl(var(--wedding-rose))] to-[hsl(var(--wedding-gold))] hover:opacity-90 z-[60] animate-float"
        >
          {isPlaying ? <Music className="h-6 w-6 text-white animate-pulse" /> : <Music className="h-6 w-6 text-white" />}
        </Button>
      )}
    </>
  );
};

export default MusicPlayer;
