import { useRef, useEffect } from "react";

const MusicPlayerV2 = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Hàm để bắt đầu phát nhạc
    const startMusic = () => {
      if (!hasStartedRef.current) {
        // Nhạc đã được preload rồi, nên play luôn
        audio.play().catch((error) => {
          console.log("Autoplay bị chặn:", error);
          // Nếu autoplay bị chặn, chờ user tương tác bất kỳ
          const playOnInteraction = () => {
            if (!hasStartedRef.current) {
              audio.play();
              hasStartedRef.current = true;
            }
          };
          
          document.addEventListener('click', playOnInteraction, { once: true });
          document.addEventListener('touchstart', playOnInteraction, { once: true });
        });
        hasStartedRef.current = true;
      }
    };

    // Phát ngay khi component mount (sau khi preload xong)
    startMusic();

    // Cleanup
    return () => {
      audio.pause();
      hasStartedRef.current = false;
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music/all.mp3"
      loop={true}
      preload="auto"
    />
  );
};

export default MusicPlayerV2;