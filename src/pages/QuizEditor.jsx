import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { getMCQs, submitAnswers } from "../services/calls";
import { toast } from "react-toastify";

const QuizEditor = () => {
  const { id, course_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [quizPercent, setQuizPercent] = useState("");
  const fetchMCQs = async () => {
    try {
      const response = await getMCQs(id);
      setQuestions(response.data);
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch MCQs", error);
    }
  };

  useEffect(() => {
    fetchMCQs();
  }, [id]);

  const handleOptionChange = (questionId, option) => {
    console.log(questionId, option);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      setError("Please attempt MCQs");
      return;
    }
    const formattedAnswers = {
      answers: Object.entries(answers).map(([questionId, selected_option]) => ({
        question: parseInt(questionId),
        selected_option,
      })),
    };

    try {
      const res = await submitAnswers(id, formattedAnswers);
      const percent = res.data.percentage;
      console.log(percent);
      console.log(res.data);
      setQuizPercent(percent);
      setShowResultModal(true);
      toast.success("Quiz Submitted successfully");
    } catch (err) {
      console.error("Submission failed", err);
    }
  };
  const handleModalClose = () => {
    setShowResultModal(false);
    if (quizPercent >= 60) {
      navigate(`/our-course/courses/${course_id}`);
    }
  };

  const retakeQuiz = () => {
    setAnswers({});
    setShowResultModal(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-[#444]">
      <Navbar />

      <main className="p-4 md:p-8 space-y-4 md:ml-60 pt-20 md:pt-8">
        <div className="text-2xl md:text-3xl font-bold text-gray-500 mb-4">Quiz</div>

        {/* Submit Section - Fixed at top on mobile, inline on desktop */}
        <div className="bg-white border border-[#b90d0d] w-full p-3 md:p-4 flex flex-col md:flex-row justify-between rounded-md items-start md:items-center gap-3 md:gap-0">
          {Object.keys(answers).length === 0 && (
            <span className="text-[#b90d0d] font-medium text-sm md:text-base">
              {error}
            </span>
          )}
          <div className="flex justify-end w-full">
            <button
              className={`p-2 md:p-2 cursor-pointer rounded-md font-medium px-4 text-white text-sm md:text-base ${
                Object.keys(answers).length === 0
                  ? "bg-gray-400"
                  : "bg-[#b90d0d]"
              }`}
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Questions Section */}
        <div className="w-full">
          <div className="space-y-4 md:space-y-6 rounded-lg p-3 md:p-6 w-full border border-[#b90d0d] bg-white max-h-[70vh] md:max-h-[75vh] overflow-y-auto">
            <div className="space-y-6 md:space-y-8">
              {questions?.map((q, index) => (
                <div key={q.id} className="w-full">
                  <p className="font-medium text-base md:text-xl bg-red-50 p-3 md:p-4 rounded-md border border-[#b90d0d] rounded-b-none">
                    {index + 1}. {q.question_text}
                  </p>
                  <div className="space-y-2 md:space-y-1 p-3 md:pl-4 text-sm md:text-lg bg-red-50 border border-[#b90d0d] rounded-md rounded-t-none">
                    {[
                      { label: "A", text: q.option_a },
                      { label: "B", text: q.option_b },
                      { label: "C", text: q.option_c },
                      { label: "D", text: q.option_d },
                    ].map((opt) => (
                      <label
                        key={opt.label}
                        className="flex items-start md:items-center gap-2 cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={opt.label}
                          checked={answers[q.id] === opt.label}
                          onChange={() => handleOptionChange(q.id, opt.label)}
                          className="mt-1 md:mt-0 flex-shrink-0"
                        />
                        <span className="text-sm md:text-base">
                          <strong>{opt.label}:</strong> {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
            <div className="text-center">
              <div className="mx-auto mb-4">
                {quizPercent >= 60 ? (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-bold mb-4">
                {quizPercent >= 60 ? "Congratulations! 🎉" : "Oops! 😔"}
              </h2>

              <div className="space-y-4">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">
                  {quizPercent}%
                </div>

                {quizPercent >= 60 ? (
                  <div className="space-y-2">
                    <p className="text-green-600 font-semibold text-sm md:text-base">
                      Excellent work! You've passed the quiz.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      <svg
                        className="h-4 w-4 text-green-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Next video unlocked!</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm md:text-base">
                      Don't worry! Learning is a journey, and every attempt
                      makes you stronger.
                    </p>
                    <p className="text-sm text-gray-500">
                      You need 60% or higher to unlock the next lesson.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-6">
                {quizPercent >= 60 ? (
                  <button
                    onClick={handleModalClose}
                    className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <svg
                      className="h-4 w-4 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Continue to Next Lesson
                  </button>
                ) : (
                  <button
                    onClick={retakeQuiz}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm md:text-base"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEditor;