import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Maximize2, RotateCcw, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_ID = "wWgTSG-CE-8";

interface VideoPlayerProps {
  instanceId?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ instanceId = "yt-player", autoPlay = false }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false); // has video ever been played
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekFeedback, setSeekFeedback] = useState<null | "forward" | "backward">(null);

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (!playerRef.current) return;
      const cur = playerRef.current.getCurrentTime?.() ?? 0;
      const dur = playerRef.current.getDuration?.() ?? 0;
      setCurrentTime(cur);
      setDuration(dur);
      if (dur > 0) setProgress((cur / dur) * 100);
    }, 500);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  // Show controls briefly then auto-hide after 5s
  const flashControls = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 5000);
  }, []);

  useEffect(() => {
    const initPlayer = () => {
      playerRef.current = new window.YT.Player(instanceId, {
        videoId: VIDEO_ID,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          autoplay: autoPlay ? 1 : 0,
        },
        events: {
          onReady: () => {
            setReady(true);
            setDuration(playerRef.current?.getDuration?.() ?? 0);
            if (autoPlay) {
              playerRef.current?.playVideo();
              setPlaying(true);
              setStarted(true);
              startProgressTracking();
            }
          },
          onStateChange: (e: { data: number }) => {
            const isPlaying =
              e.data === window.YT.PlayerState.PLAYING ||
              e.data === window.YT.PlayerState.BUFFERING;
            setPlaying(isPlaying);
            if (isPlaying) {
              setStarted(true);
              startProgressTracking();
            } else {
              stopProgressTracking();
              // When paused keep controls visible
              setShowControls(true);
              if (hideTimeout.current) clearTimeout(hideTimeout.current);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      stopProgressTracking();
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      playerRef.current?.destroy();
      playerRef.current = null;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [instanceId, autoPlay, startProgressTracking, stopProgressTracking]);

  const toggle = () => {
    if (!ready || !playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const seek = (seconds: number) => {
    if (!ready || !playerRef.current) return;
    const cur = playerRef.current.getCurrentTime?.() ?? 0;
    const dur = playerRef.current.getDuration?.() ?? 0;
    playerRef.current.seekTo(Math.min(Math.max(cur + seconds, 0), dur), true);
    setSeekFeedback(seconds > 0 ? "forward" : "backward");
    setTimeout(() => setSeekFeedback(null), 700);
    flashControls();
  };

  const seekToPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ready || !playerRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const dur = playerRef.current.getDuration?.() ?? 0;
    playerRef.current.seekTo(ratio * dur, true);
    flashControls();
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    }) | null;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())?.catch(() => {});
  };

  const handleContainerClick = () => {
    if (!started) {
      // First play
      toggle();
      return;
    }
    if (!playing) {
      toggle();
      return;
    }
    // Video is playing — show controls on tap/click
    flashControls();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-primary opacity-25 blur-3xl" />

      <div
        ref={containerRef}
        className="relative aspect-video overflow-hidden rounded-3xl bg-primary shadow-glow ring-1 ring-border cursor-pointer"
        onClick={handleContainerClick}
        onMouseMove={() => { if (playing && started) flashControls(); }}
      >
        {/* YouTube player */}
        <div id={instanceId} className="absolute inset-0 h-full w-full" />

        {/* Branding strip */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center bg-gradient-to-b from-black/90 via-black/60 to-transparent px-5 py-4 md:px-7 md:py-5">
          <span className="font-display text-sm font-semibold tracking-wide text-white md:text-base">
            Medebir App Tutorial
          </span>
        </div>

        {/* ── BIG CENTER PLAY BUTTON — only before first play ── */}
        <AnimatePresence>
          {!started && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow animate-pulse-ring md:h-24 md:w-24"
              >
                <Play className="ml-1 h-9 w-9 fill-current md:h-10 md:w-10" />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CENTER PAUSE INDICATOR — visible when playing & controls shown ── */}
        <AnimatePresence>
          {started && showControls && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur md:h-20 md:w-20">
                {playing ? (
                  <Pause className="h-7 w-7 fill-current md:h-9 md:w-9" />
                ) : (
                  <Play className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SEEK FEEDBACK flash ── */}
        <AnimatePresence>
          {seekFeedback && (
            <motion.div
              key={seekFeedback}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-none absolute top-1/2 z-30 -translate-y-1/2 flex flex-col items-center gap-1 ${
                seekFeedback === "forward" ? "right-[18%]" : "left-[18%]"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                {seekFeedback === "forward" ? (
                  <RotateCw className="h-7 w-7" />
                ) : (
                  <RotateCcw className="h-7 w-7" />
                )}
              </div>
              <span className="text-xs font-bold text-white/90">5s</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTTOM CONTROLS — shown after first play, auto-hide after 5s ── */}
        <AnimatePresence>
          {started && showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div
                ref={progressRef}
                onClick={seekToPosition}
                className="group relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 hover:h-2.5 transition-all duration-150"
              >
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-3 w-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-2">
                {/* Rewind 5s */}
                <button
                  type="button"
                  onClick={() => seek(-5)}
                  aria-label="Rewind 5 seconds"
                  className="flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-[10px] font-bold">5</span>
                </button>

                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow transition-transform hover:scale-105 active:scale-95"
                >
                  {playing ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                  )}
                </button>

                {/* Forward 5s */}
                <button
                  type="button"
                  onClick={() => seek(5)}
                  aria-label="Forward 5 seconds"
                  className="flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span className="text-[10px] font-bold">5</span>
                  <RotateCw className="h-4 w-4 md:h-5 md:w-5" />
                </button>

                {/* Time */}
                <span className="ml-1 text-xs text-white/70 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
}
