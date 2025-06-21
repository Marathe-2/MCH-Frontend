import React, { useEffect, useRef, useState } from "react";
import Navbar from "../component/Navbar";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import {
  createVideoProgress,
  getCourseDetails,
  getCourseVideo,
  getVideoProgress,
  updateVideoProgress,
} from "../services/calls";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  ChevronRight,
  Circle,
  CirclePlay,
  ClipboardList,
  User,
} from "lucide-react";

const CourseDetails = () => {
  const [details, setDetails] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [progressLength, setProgressLength] = useState([]);
  const [quizReq, setQuizReq] = useState(false);
  const { id } = useParams();

  const fetchCourseDetails = async () => {
    try {
      const response = await getCourseDetails(id);
      if (response.status === 200) setDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourseVideos = async () => {
    try {
      const res = await getCourseVideo(id);
      if (res.status === 200) {
        setCourseVideos(res?.data);
        if (res?.data?.length > 0) {
          setSelectedVideo(res?.data[0].video_file);
          setSelectedVideoTitle(res?.data[0].title);
          setVideoId(res?.data[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const email = localStorage.getItem("email");
  const [progressId, setProgressId] = useState(null);
  const [initialFetched, setInitialFetched] = useState(false);
  const videoRef = useRef();
  const [progressMap, setProgressMap] = useState({});
  const navigate = useNavigate();
  const hasCompletedRef = useRef(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseVideos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!courseVideos || courseVideos.length === 0) return;
    const index = courseVideos.findIndex((vid) => vid.id === videoId);
    const isQuizRequired = index !== 0 && index !== courseVideos.length - 1;
    setQuizReq(isQuizRequired);
  }, [videoId, courseVideos]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getVideoProgress(id);
        if (response.status === 200 && response.data?.results) {
          const progressArray = response?.data?.results;
          const currentProgress = progressArray.filter(
            (progress) => String(progress.course_id) === String(id)
          );
          setProgressLength(currentProgress.length);
          const progressByVideo = {};
          progressArray.forEach((item) => {
            progressByVideo[item.video] = item;
          });
          setProgressMap(progressByVideo);

          if (progressByVideo[videoId]) {
            setProgressId(progressByVideo[videoId].id);
            hasCompletedRef.current = progressByVideo[videoId].completed;
            if (videoRef.current) {
              videoRef.current.currentTime =
                parseFloat(progressByVideo[videoId].watched_time) || 0;
            }
          }
        }
      } catch (error) {
        // ...
      } finally {
        setInitialFetched(true);
      }
    };
    fetchProgress();
  }, [userId, videoId]);

  function timeStringToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return 0;
    const [hh = "0", mm = "0", ss = "0"] = timeStr.split(":");
    return parseInt(hh, 10) * 3600 + parseInt(mm, 10) * 60 + parseFloat(ss);
  }

  useEffect(() => {
    if (progressMap[videoId]) {
      const progress = progressMap[videoId];
      setProgressId(progress.id);
      hasCompletedRef.current = progress.completed;
      if (videoRef.current) {
        videoRef.current.currentTime =
          timeStringToSeconds(progress.watched_time) || 0;
      }
    } else {
      setProgressId(null);
      hasCompletedRef.current = false;
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [videoId, progressMap]);

  // --- PROGRESS SAVE INTERVAL (now 30s) ---
  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended &&
        videoRef.current.readyState > 2
      ) {
        const progressData = new FormData();
        progressData.append("user", userId);
        progressData.append("video", videoId);
        progressData.append("watched_time", videoRef.current.currentTime);
        if (progressId) {
          await updateVideoProgress(progressId, progressData);
        } else {
          const res = await createVideoProgress(progressData);
          if (res.status === 201) {
            setProgressId(res.data.id);
          }
        }
      }

      if (videoRef.current && videoRef.current.ended) {
        hasCompletedRef.current = true;
        const completedData = new FormData();
        completedData.append("user", userId);
        completedData.append("video", videoId);
        completedData.append("completed", true);
        completedData.append("watched_time", videoRef.current.duration);

        if (progressId) {
          await updateVideoProgress(progressId, completedData);
          setLessonCompleted(true);
          if (quizReq) {
            navigate(`/our-course/quiz/${id}/${videoId}`);
          }
        } else {
          const res = await createVideoProgress(completedData);
          if (res.status === 201) {
            setProgressId(res.data.id);
            setLessonCompleted(true);
            if (quizReq) {
              navigate(`/our-course/quiz/${id}/${videoId}`);
            }
          }
        }
      }
    }, 30000); // <--- 30 seconds!

    return () => clearInterval(interval);
  }, [initialFetched, progressId, userId, videoId, quizReq, id, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="p-2 sm:p-4 md:p-8 md:ml-60 pt-16 md:pt-8">
        <div className="mb-8 font-medium flex items-center gap-4 text-gray-500">
          Our Courses <ChevronRight />
          <Link to={"/our-course"} className="hover:text-orange-700">
            All Courses
          </Link>{" "}
          <ChevronRight />
          <span className="font-semibold text-black">{details?.title}</span>
        </div>

        {/* Desktop: left-right, Mobile: stacked */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Video and info - left side */}
          <div className="w-full lg:w-3/5 flex flex-col">
            <div className="rounded-xl overflow-hidden border border-gray-300 bg-black">
              <div className="relative aspect-video w-full max-h-[60vw] sm:max-h-[400px] bg-black">
                <video
                  controls
                  controlsList="nodownload noplaybackrate"
                  className="absolute inset-0 w-full h-full object-contain rounded-t-xl shadow"
                  style={{ outline: "none" }}
                  key={selectedVideo}
                  ref={videoRef}
                  playsInline
                  onLoadedMetadata={() => {
                    const progress = progressMap[videoId];
                    if (progress?.watched_time) {
                      const seconds = timeStringToSeconds(progress.watched_time);
                      if (!isNaN(seconds)) {
                        setTimeout(() => {
                          videoRef.current.currentTime = seconds;
                        }, 100);
                      }
                    }
                  }}
                >
                  <source
                    src={`${import.meta.env.VITE_API_BASE_URL}${selectedVideo}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video.
                </video>
              </div>
              <div className="rounded-b-xl p-4 bg-white">
                <h3 className="text-lg font-medium flex items-center gap-4">
                  <CirclePlay className="text-green-500" /> {selectedVideoTitle}
                </h3>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="mt-8">
              <div className="flex items-center gap-4 bg-[#b90d0d] p-2 rounded-md text-white">
                <div className="bg-red-200 p-2 rounded-full">
                  <User className="text-red-800" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{`${firstName} ${lastName}`}</h3>
                  <p className="text-sm text-gray-200">{email}</p>
                </div>
                <div className="ml-auto text-sm text-gray-200">
                  ⭐ 4.3 | 📚 {courseVideos?.length} Lessons
                </div>
              </div>
              <div className="mt-4 text-md font-medium text-gray-700">
                <p className="mb-2">{details?.description}</p>
              </div>
            </div>
          </div>

          {/* Progress - right side on desktop */}
          <div className="w-full lg:w-2/5 p-4 lg:p-6 rounded-xl bg-white border border-gray-300 max-h-[250px] sm:max-h-[340px] md:max-h-[400px] lg:max-h-[650px] overflow-y-auto">
            <h4 className="text-xl font-medium mb-4">
              Your Progress{" "}
              <span className="text-xl text-gray-500">
                {progressLength}/{courseVideos?.length}
              </span>
            </h4>
            <ul>
              {courseVideos?.map((item, index) => {
                const progress = progressMap[item.id];
                const isCompleted = progress?.completed;
                const isUnlocked = (idx) => {
                  if (idx === 0) return true;
                  const prevVideo = courseVideos[idx - 1];
                  const prevProgress = progressMap[prevVideo.id];
                  if (idx === 1) return prevProgress?.completed;
                  return prevProgress?.completed && prevProgress?.quiz_pass;
                };
                const isQuizRequired =
                  index !== 0 && index !== courseVideos.length - 1;
                return (
                  <li
                    key={item.id}
                    onClick={() => {
                      if (!isUnlocked(index)) return;
                      setSelectedVideo(item.video_file);
                      setSelectedVideoTitle(item?.title);
                      setVideoId(item.id);
                    }}
                    className={`flex items-center justify-between font-medium hover:bg-[#b90d0d] p-2 rounded-md mb-1 hover:text-white ${
                      !isUnlocked(index)
                        ? "opacity-50 pointer-events-none "
                        : ""
                    } cursor-pointer ${
                      isCompleted && "bg-green-300 text-green-600"
                    } px-4 ${item.id === videoId && "bg-red-800 text-white "}`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`bg-white p-2 rounded-full ${
                          isCompleted
                            ? "border-2 border-green-400"
                            : "border-gray-400 border-2"
                        } `}
                      >
                        {isCompleted ? (
                          <Check className="text-[#b90d0d]" />
                        ) : (
                          <Circle className="text-gray-400" />
                        )}
                      </span>
                      {item.title}{" "}
                    </div>
                    {isCompleted && isQuizRequired && (
                      <Link
                        to={`/our-course/quiz/${id}/${item.id}`}
                        className="bg-green-500 p-2 px-4 rounded-full flex text-white items-center gap-2 text-sm"
                      >
                        <ClipboardList size={18} />
                        Quiz
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
