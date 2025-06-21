import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { FiBookOpen } from "react-icons/fi";
import { FaRegFile, FaMedal } from "react-icons/fa6";
import { LuClock } from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card, { CardContent } from "../component/Card";
import Progress from "../component/Progress";
import figmaicon from "../assets/figma.png";
import uiux from "../assets/5757453.jpg";
import { getCourses, getDashboardData } from "../services/calls";
import { ClockArrowDown, SquarePlay } from "lucide-react";

const Overviewscreen = () => {
  const [greet, setGreet] = useState("");
  const [courseId, setCourseId] = useState("");
  const [course, setCourse] = useState([]);
  const [dashboardData, setDashboardData] = useState({});

  const firstName = localStorage.getItem("first_name");

  const greetUser = () => {
    const currentHour = new Date().getHours();
    let greeting = "";

    if (currentHour < 12) {
      greeting = "Good Morning";
    } else if (currentHour < 17) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
    setGreet(greeting);
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      if (response.status === 200) {
        const data = response.data.results;
        const active = data.filter((course) => course.status === "active");
        setCourse(active);
        if (active.length > 0) {
          setCourseId(active[0].id);
        }
      } else {
        console.log("An error occurred while fetching courses.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboardData = async () => {
    if (!courseId) return;
    try {
      const res = await getDashboardData(courseId);
      console.log(res?.data);
      setDashboardData(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    greetUser();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [courseId]);

  const chartData = [
    { name: "Jan", Study: 20, Exams: 30 },
    { name: "Feb", Study: 25, Exams: 20 },
    { name: "Mar", Study: 22, Exams: 38 },
    { name: "Apr", Study: 38, Exams: 22 },
    { name: "May", Study: 25, Exams: 20 },
    { name: "Jun", Study: 30, Exams: 25 },
  ];

  const courses = [
    {
      name: "UX Design Beginner",
      date: "Apr 1, 2024",
      rating: 4.1,
      lessons: 10,
      progress: 80,
      instructor: "Jenny Wilson",
      image: uiux,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <main className="p-2 sm:p-4 md:p-8 space-y-6 md:ml-60 pt-20 md:pt-8">

        {/* Header Section */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full">
  <div className="flex-1 min-w-0">
    <h2 className="text-2xl md:text-3xl font-bold">{`${greet} ${firstName}`}</h2>
    <p className="text-gray-500 font-semibold mt-2">
      Let's learn something new today!
    </p>
  </div>
  {/* Course Selector */}
  <div className="w-full md:w-auto box-border">
    <label htmlFor="courseSelector" className="mb-1 font-medium text-gray-700 block md:hidden">
      Select Course
    </label>
<div className="w-full md:w-auto">
  <select
    className="
      w-full md:w-auto md:min-w-[200px] border rounded-md p-2
      text-base focus:outline-none focus:ring-2 focus:ring-rose-700 transition
      bg-white
    "
  >
    {course.map((option) => (
      <option key={option.id} value={option.id}>
        {option.title}
      </option>
    ))}
  </select>
</div>

  </div>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-[#fcf3e8] rounded-full flex-shrink-0">
                <SquarePlay size={20} className="text-yellow-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold">
                  {dashboardData.total_videos ?? "--"}
                </div>
                <div className="text-sm md:text-lg font-semibold text-gray-500">
                  Total Videos
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-[#fcf3e8] rounded-full flex-shrink-0">
                <FiBookOpen size={20} className="text-yellow-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold">
                  {dashboardData.completed_videos ?? "--"}
                </div>
                <div className="text-sm md:text-lg font-semibold text-gray-500">
                  Completed Videos
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-[#fcf3e8] rounded-full flex-shrink-0">
                <ClockArrowDown size={20} className="text-yellow-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold">
                  {dashboardData.pending_videos ?? "--"}
                </div>
                <div className="text-sm md:text-lg font-semibold text-gray-500">
                  Pending Videos
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-[#ede7f6] rounded-full flex-shrink-0">
                <LuClock size={20} className="text-purple-700" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold">
                  {(() => {
                    const time = dashboardData?.watched_time;
                    if (!time) return "--";
                    const hrs =
                      (time.hours ?? 0) +
                      (time.minutes ?? 0) / 60 +
                      (time.seconds ?? 0) / 3600;
                    return `${hrs.toFixed(2)} hrs`;
                  })()}
                </div>
                <div className="text-sm md:text-lg font-semibold text-gray-500">
                  Watched Time
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="space-y-4 md:space-y-6 mt-8 md:mt-15">
          <div>
            <p className="font-bold text-lg md:text-xl">Hour spent</p>
          </div>
          <div className="px-3 md:px-5 py-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={chartData} barGap={8} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{ value: "Hr", angle: -90, position: "insideLeft" }}
                />
                <Tooltip formatter={(value, name) => [`${value} Hr`, name]} />
                <Legend />
                <Bar
                  dataKey="Study"
                  stackId="a"
                  fill="#f87171"
                  radius={[10, 10, 0, 0]}
                />
                <Bar
                  dataKey="Exams"
                  stackId="a"
                  fill="#f5f5dc"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overviewscreen;



