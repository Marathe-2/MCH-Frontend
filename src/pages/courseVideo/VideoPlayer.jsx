import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ videoUrl, videoId, userId }) => {
  const videoRef = useRef();

  useEffect(() => {
    const loadProgress = async () => {
      const res = await fetch(
        `/api/video-progress?userId=${userId}&videoId=${videoId}`
      );
      const data = await res.json();
      if (data?.last_watched_time && videoRef.current) {
        videoRef.current.currentTime = data.last_watched_time;
      }
    };
    loadProgress();
  }, [videoId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        fetch("/api/save-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            video_id: videoId,
            last_watched_time: videoRef.current.currentTime,
          }),
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [videoId]);

  return (
    <video ref={videoRef} controls className="w-full rounded-xl shadow">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video .
    </video>
  );
};

export default VideoPlayer;
