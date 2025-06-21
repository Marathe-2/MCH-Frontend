import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { Link } from "react-router-dom";
import study from "../assets/study.jpg";
import { getCourses } from "../services";

const OurCourses = () => {
  const [courses, setCourses] = useState([]);
  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      if (response.status === 200) {
        const data = response.data.results;
        const active = data.filter((course) => course.status === "active");
        setCourses(active);
      } else {
        console.log("An error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans flex">
      <Navbar />

      <main className="flex-1 p-2 sm:p-4 md:p-8 pt-16 md:pt-8 lg:pl-60 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-0 md:ml-8 lg:ml-16">Our Courses</h1>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:ml-8 lg:ml-16">
            {courses.map((course) => (
              <Link key={course.id} to={`/our-course/courses/${course.id}`} className="block h-full">
                <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-xl active:scale-[0.98] transition h-full min-h-[400px] flex flex-col cursor-pointer">
                  <img
                    src={
                      course.image
                        ? import.meta.env.VITE_API_BASE_URL + course.image
                        : study
                    }
                    alt={course.name}
                    className="rounded-xl object-cover w-full h-44 sm:h-48"
                  />
                  <h2 className="mt-4 font-semibold text-lg">{course.title}</h2>
                  <p className="text-sm text-gray-500 mt-1 flex-1">
                    {course.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center">No Courses Available</p>
        )}
      </main>
    </div>
  );
};

export default OurCourses;
