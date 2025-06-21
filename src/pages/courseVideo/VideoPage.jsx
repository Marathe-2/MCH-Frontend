import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../component/Navbar";
import VideoPlayer from "./VideoPlayer";
import { getVideoDetails } from "../../services/calls";

const VideoPage = () => {
  const { id, videoId } = useParams();
  const [video, setVideo] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getVideoDetails(videoId);
      setVideo(res);
    };
    fetchVideo();
  }, [id, videoId]);

  return (
    <div className="flex min-h-screen bg-[#fdf9f6]">
      <aside className="bg-[#fcf3e8] p-6 w-[250px]">
        <Navbar />
      </aside>
      <main className="flex-1 p-10">
        {video ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
            <VideoPlayer
              videoUrl={video.video_url}
              videoId={videoId}
              userId={userId}
            />
            <p className="mt-4 text-gray-700">{video.description}</p>
          </>
        ) : (
          <p>Loading video...</p>
        )}
      </main>
    </div>
  );
};

export default VideoPage;
