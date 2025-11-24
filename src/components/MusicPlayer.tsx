import { useState, useRef, useEffect } from "react";

interface MusicPlayerProps {
  playlist: { title: string; src: string }[];
}

const audioCache = new Map<string, Blob>();
const audioCacheUrls = new Map<string, string>();

const preloadNextTrack = async (track: { title: string; src: string }) => {
  if (audioCache.has(track.src)) {
    return;
  }

  try {
    const response = await fetch(track.src);
    const blob = await response.blob();
    
    audioCache.set(track.src, blob);
    const objectUrl = URL.createObjectURL(blob);
    audioCacheUrls.set(track.src, objectUrl);
    
    console.log(`✅ Cached next: ${track.title}`);
  } catch (error) {
    console.error(`❌ Failed to cache: ${track.title}`, error);
  }
};

const freePreviousTrack = (src: string) => {
  const objectUrl = audioCacheUrls.get(src);
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
  audioCache.delete(src);
  audioCacheUrls.delete(src);
  console.log(`🗑️ Freed cache: ${src}`);
};

const getAudioUrl = (src: string) => {
  return audioCacheUrls.get(src) || src;
};

const MusicPlayer = ({ playlist }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasAutoPlayedRef = useRef(false);

  // Auto-play on mount
  useEffect(() => {
    if (!hasAutoPlayedRef.current && audioRef.current) {
      hasAutoPlayedRef.current = true;
      
      // Preload first track
      preloadNextTrack(playlist[0]).then(() => {
        // Try to autoplay
        const playPromise = audioRef.current?.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              console.log('🎵 Auto-play started');
              // Preload next track
              const nextIndex = (0 + 1) % playlist.length;
              preloadNextTrack(playlist[nextIndex]);
            })
            .catch((error) => {
              console.log('⚠️ Auto-play blocked, waiting for user interaction', error);
              setIsPlaying(false);
            });
        }
      });
    }
  }, [playlist]);

  // Preload next track when current track changes
  useEffect(() => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
    
    // Preload next
    preloadNextTrack(playlist[nextIndex]);
    
    // Free previous (but keep current and next)
    if (currentTrack > 1) {
      const twoTracksAgo = (currentTrack - 2 + playlist.length) % playlist.length;
      freePreviousTrack(playlist[twoTracksAgo].src);
    }
  }, [currentTrack, playlist]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Play error:', error);
            setIsPlaying(false);
            // Retry after 1 second
            setTimeout(() => {
              if (audioRef.current && retryCount < 3) {
                setRetryCount(prev => prev + 1);
                audioRef.current.play()
                  .then(() => {
                    setIsPlaying(true);
                    setRetryCount(0);
                  })
                  .catch(() => console.error('Retry failed'));
              }
            }, 1000);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, retryCount]);

  // Error handling with retry
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: Event) => {
      console.error('❌ Audio error:', e);
      setIsPlaying(false);
      
      // Auto retry
      if (retryCount < 3) {
        console.log(`🔄 Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          audio.play()
            .then(() => {
              setIsPlaying(true);
              setRetryCount(0);
            })
            .catch(() => console.error('Retry failed'));
        }, 2000);
      }
    };

    const handleCanPlay = () => {
      console.log('✅ Audio ready to play');
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [retryCount]);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  return (
    <audio
      ref={audioRef}
      src={getAudioUrl(playlist[currentTrack]?.src)}
      onEnded={handleNext}
      loop={false}
      preload="auto"
    />
  );
};

export default MusicPlayer;