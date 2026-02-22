import { useEffect, useRef, useState } from "react";
import VideoContent from "./VideoContent";

export default function Video({ url }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };
    const onLoadStart = () => setIsLoading(true);
    const onLoadedMetadata = () =>
      setIsLoading(false) && setDuration(video.duration || 0);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(video);

    return () => {
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadstart", onLoadStart);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      observer.disconnect();
      video.pause();
    };
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) video.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Array.isArray(time) ? time[0] : time;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <VideoContent
      videoRef={videoRef}
      url={url}
      isPlaying={isPlaying}
      isMuted={isMuted}
      isLoading={isLoading}
      isBuffering={isBuffering}
      currentTime={currentTime}
      duration={duration}
      fullscreen={fullscreen}
      onPlayPause={handlePlayPause}
      onToggleMute={toggleMute}
      onToggleFullscreen={toggleFullscreen}
      onSeek={handleSeek}
      showControls={true}
    />
  );
}
