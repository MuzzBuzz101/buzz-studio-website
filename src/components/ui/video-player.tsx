"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = false,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const onTime = () => {
      setCurrent(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const value = Number(e.target.value);
    video.currentTime = (value / 100) * duration;
    setProgress(value);
  };

  const requestFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  if (!src) {
    return (
      <div
        className={cn(
          "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-obsidian-800 via-obsidian-900 to-black",
          className
        )}
      >
        <div className="film-grain absolute inset-0" />
        <div className="relative z-10 text-center">
          <p className="font-display text-lg text-obsidian-200">
            Showreel Coming Soon
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-obsidian-400">
            Drop your video at /public/videos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/player relative overflow-hidden rounded-2xl border border-white/10 bg-black",
        className
      )}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => showControls && setControlsVisible(!isPlaying)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        className="h-full w-full object-cover"
        onClick={togglePlay}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        </div>
      )}

      {showControls && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10 transition-opacity duration-300",
            controlsVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={progress || 0}
            onChange={seek}
            aria-label="Seek"
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
          />
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                data-cursor="hover"
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
              </button>
              <button
                onClick={toggleMute}
                data-cursor="hover"
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <span className="text-xs tabular-nums text-white/70">
                {formatTime(current)} / {formatTime(duration)}
              </span>
            </div>
            <button
              onClick={requestFullscreen}
              data-cursor="hover"
              aria-label="Fullscreen"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
