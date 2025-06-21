import React from "react";
import Navbar from "../component/Navbar";
import { FaDownload, FaSearch } from "react-icons/fa";
import { Bell } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Search,
} from "lucide-react";
import { IoIosShareAlt } from "react-icons/io";
import certificate from "../assets/certificate.png";

const Certificate = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = certificate;
    link.download = "certificate.png"; // You can change the name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Main Content */}
      <main className="p-4 md:p-8 space-y-6 md:ml-60 pt-20 md:pt-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Certificates</h1>
          <div className="flex items-center gap-4">
            {/* Commented out buttons remain as they were */}
            {/* <button className="p-2 bg-white rounded-lg shadow">
              <Search className="w-5 h-5" />
            </button> */}
            {/* <button className="p-2 bg-white rounded-lg shadow">
              <Bell className="w-5 h-5" />
            </button> */}
            {/* <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow">
              Apply New Course
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 pb-2 text-base md:text-lg">
          <button className="font-semibold pb-2 text-black border-b-3 border-b-rose-800">
            All Certificates
          </button>
          {/* Commented out tabs remain as they were */}
          {/* <button className="font-semibold pb-2 text-gray-500">
            Active (04)
          </button>
          <button className="font-semibold pb-2 text-gray-500">
            Complete (20)
          </button> */}
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative bg-white rounded-xl shadow p-4 border border-gray-300">
            <div className="relative">
              <div>
                <div className="relative p-3 md:p-5">
                  <img
                    src={certificate}
                    alt="Certificate"
                    id="certificate-content"
                    className="h-40 md:h-48 w-full object-contain"
                  />
                  <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    >
                      <FaDownload size={16} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Placeholder for future certificates */}
          {/* 
          <div className="relative bg-white rounded-xl shadow p-4 border border-gray-300">
            // Future certificate 2
          </div>
          <div className="relative bg-white rounded-xl shadow p-4 border border-gray-300">
            // Future certificate 3
          </div>
          */}
        </div>
      </main>
    </div>
  );
};

export default Certificate;