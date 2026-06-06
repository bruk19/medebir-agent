interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  class Player {
    constructor(el: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
  }
  interface PlayerOptions {
    videoId: string;
    playerVars?: Record<string, unknown>;
    events?: {
      onReady?: () => void;
      onStateChange?: (e: { data: number }) => void;
    };
  }
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}
