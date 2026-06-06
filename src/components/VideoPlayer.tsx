import { useEffect, useRef, useState } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_ID = "wWgTSG-CE-8";

export function VideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: VIDEO_ID,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING || e.data === window.YT.PlayerState.BUFFERING);
          },
        },
      });
    };

    // If API already loaded
    if (window.YT?.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, []);

  const toggle = () => {
    if (!ready || !playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const showButton = !playing || hovering;

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-primary opacity-25 blur-3xl" />

      <div
        ref={containerRef}
        className="relative aspect-video overflow-hidden rounded-3xl bg-primary shadow-glow ring-1 ring-border"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* YouTube player target */}
        <div id="yt-player" className="absolute inset-0 h-full w-full" />

        {/* Branding strip */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center bg-gradient-to-b from-black/90 via-black/60 to-transparent px-5 py-4 md:px-7 md:py-5">
          <span className="font-display text-sm font-semibold tracking-wide text-white md:text-base">
            Medebir App Tutorial
          </span>
        </div>

        {/* Click overlay */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute inset-0 z-10 flex items-center justify-center bg-transparent focus:outline-none"
        >
          <AnimatePresence mode="wait">
            {showButton && (
              <motion.span
                key={playing ? "pause" : "play"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: playing ? 0.85 : 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow md:h-24 md:w-24 ${
                  !playing ? "animate-pulse-ring" : ""
                }`}
              >
                {playing ? (
                  <Pause className="h-9 w-9 fill-current md:h-10 md:w-10" />
                ) : (
                  <Play className="ml-1 h-9 w-9 fill-current md:h-10 md:w-10" />
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Fullscreen button */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const el = containerRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }) | null;
            if (!el) return;
            if (document.fullscreenElement) {
              document.exitFullscreen?.();
            } else {
              (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())?.catch(() => {});
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovering || !playing ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          aria-label="Toggle fullscreen"
          className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 md:h-11 md:w-11"
        >
          <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />
        </motion.button>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
}