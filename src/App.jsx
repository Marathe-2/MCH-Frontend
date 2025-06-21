import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Overviewscreen from "./pages/Overviewscreen";
import OurCourses from "./pages/OurCourses ";
import Certificate from "./pages/Certificate";
import QuizEditor from "./pages/QuizEditor";
import "react-toastify/dist/ReactToastify.css";
import Auth from "./pages/auth/Auth";
import VideoPage from "./pages/courseVideo/VideoPage";
import CourseDetails from "./pages/CourseDetails";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overviewscreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/our-course"
          element={
            <ProtectedRoute>
              <OurCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate"
          element={
            <ProtectedRoute>
              <Certificate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/our-course/quiz/:course_id/:id"
          element={
            <ProtectedRoute>
              <QuizEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/our-course/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/courses/:id/video/:videoId" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
