import { useRef, useEffect } from "react";

const MusicPlayerV2 = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Preload nhạc ngay khi component mount
    audio.load();

    // Hàm để bắt đầu phát nhạc
    const startMusic = () => {
      if (!hasStartedRef.current) {
        audio.play().catch((error) => {
          console.log("Autoplay bị chặn:", error);
          // Nếu autoplay bị chặn, chờ user tương tác
          document.addEventListener('click', () => {
            if (!hasStartedRef.current) {
              audio.play();
              hasStartedRef.current = true;
            }
          }, { once: true });
        });
        hasStartedRef.current = true;
      }
    };

    // Thử phát ngay
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