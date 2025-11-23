import { useState, useRef, useEffect } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

interface MusicPlayerProps {
  playlist: { title: string; src: string }[];
  globalClickToggle?: boolean;
}

const audioCache = new Map();
const audioCacheUrls = new Map();

const preloadPlaylist = async (playlist) => {
  const promises = playlist.map(async (track) => {
    if (audioCache.has(track.src)) {
      return;
    }

    try {
      const response = await fetch(track.src);
      const blob = await response.blob();
      
      audioCache.set(track.src, blob);
      const objectUrl = URL.createObjectURL(blob);
      audioCacheUrls.set(track.src, objectUrl);
      
      console.log(`✅ Cached: ${track.title}`);
    } catch (error) {
      console.error(`❌ Failed to cache: ${track.title}`, error);
    }
  });

  await Promise.all(promises);
};

const getAudioUrl = (src) => {
  return audioCacheUrls.get(src) || src;
};

const MusicPlayer = ({ playlist, globalClickToggle = true }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCaching, setIsCaching] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);
  const hasCachedPlaylistRef = useRef(false);
  const clickTimeoutRef = useRef(null);
  const touchHandledRef = useRef(false);
  const buttonRefs = useRef(new Set());

  useEffect(() => {
    if (!hasCachedPlaylistRef.current) {
      hasCachedPlaylistRef.current = true;
      
      preloadPlaylist(playlist).then(() => {
        setIsCaching(false);
        console.log('🎵 Playlist đã được cache!');
      });
    }
  }, [playlist]);

  useEffect(() => {
    if (isPlaying && !isCaching) {
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
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e) => {
      console.error('❌ Audio error:', e);
      setIsPlaying(false);
    };

    const handleStalled = () => {
      console.warn('⚠️ Audio stalled - buffering...');
    };

    const handleWaiting = () => {
      console.log('⏳ Audio waiting for data...');
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, []);

  // Global click/touch toggle
  useEffect(() => {
    if (!globalClickToggle || isCaching) return;

    const handleGlobalClick = (e) => {
      // Kiểm tra xem có phải click vào button không
      let isButtonClick = false;
      buttonRefs.current.forEach(ref => {
        if (ref && ref.contains(e.target)) {
          isButtonClick = true;
        }
      });

      // Nếu click vào button, để button xử lý
      if (isButtonClick) return;

      // Click ở nơi khác → toggle play/pause
      setIsPlaying(prev => !prev);
    };

    const handleGlobalTouch = (e) => {
      // Kiểm tra xem có phải touch vào button không
      let isButtonTouch = false;
      buttonRefs.current.forEach(ref => {
        if (ref && ref.contains(e.target)) {
          isButtonTouch = true;
        }
      });

      if (isButtonTouch) return;

      setIsPlaying(prev => !prev);
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('touchend', handleGlobalTouch);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('touchend', handleGlobalTouch);
    };
  }, [globalClickToggle, isCaching]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle both touch and click for Smart TV compatibility
  const handleMainButtonTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    touchHandledRef.current = true;
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setIsExpanded(true);
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      togglePlay();
      clickTimeoutRef.current = null;
    }, 300);
  };

  const handleMainButtonClick = (e) => {
    e.stopPropagation();
    
    // Prevent double-firing on touch devices
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setIsExpanded(true);
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      togglePlay();
      clickTimeoutRef.current = null;
    }, 300);
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentTrack((prev) => {
      const nextTrack = (prev + 1) % playlist.length;
      return nextTrack;
    });
    setIsPlaying(true);
    setIsExpanded(false);
  };

  const handlePrevious = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentTrack((prev) => {
      const prevTrack = (prev - 1 + playlist.length) % playlist.length;
      return prevTrack;
    });
    setIsPlaying(true);
    setIsExpanded(false);
  };

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

      {/* Thông báo global click */}
      {globalClickToggle && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            💡 Click ở đâu cũng được để {isPlaying ? 'tắt' : 'bật'} nhạc
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-[60] flex items-center gap-3">
        {isExpanded && (
          <button
            ref={(el) => el && buttonRefs.current.add(el)}
            onClick={handlePrevious}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrevious(e);
            }}
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 animate-in fade-in zoom-in duration-200 cursor-pointer"
            title="Bài trước"
            style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}

        <button
          ref={(el) => el && buttonRefs.current.add(el)}
          onClick={handleMainButtonClick}
          onTouchStart={handleMainButtonTouch}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          title={isExpanded ? "Click 1 lần: Play/Pause" : "Click 1 lần: Play/Pause | Click 2 lần: Hiện controls"}
          style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white ml-0.5" />
          )}
        </button>

        {isExpanded && (
          <button
            ref={(el) => el && buttonRefs.current.add(el)}
            onClick={handleNext}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext(e);
            }}
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-pink-400 to-purple-400 hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 animate-in fade-in zoom-in duration-200 cursor-pointer"
            title="Bài tiếp theo"
            style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;