import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/mch logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#b90d0d] text-white rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-[#b90d0d] border-r border-red-500
          w-64 md:w-60
          transform transition-transform duration-300 ease-in-out md:transition-none
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          flex flex-col h-full
        `}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 mb-2 mt-12 md:mt-0">
          <img
            src={logo || "/placeholder.svg"}
            alt="MCH"
            className="h-16 md:h-24 object-cover w-full bg-white"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col gap-3 md:gap-4 p-3 md:p-2">
            <NavLink
              to="/overview"
              end
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `text-gray-600 font-medium px-3 py-2 md:py-1 rounded transition-colors ${
                  isActive
                    ? "font-bold bg-white text-gray-800 w-full"
                    : "text-white hover:bg-white hover:text-black hover:bg-opacity-10"
                }`
              }
            >
              Overview
            </NavLink>

            <NavLink
              to="/our-course"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `text-gray-600 font-medium px-3 py-2 md:py-1 rounded transition-colors ${
                  isActive
                    ? "font-bold bg-white text-gray-800 w-full"
                    : "text-white hover:bg-white hover:text-black hover:bg-opacity-10"
                }`
              }
            >
              Our Courses
            </NavLink>

            <NavLink
              to="/certificate"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `text-gray-600 font-medium px-3 py-2 md:py-1 rounded transition-colors ${
                  isActive
                    ? "font-bold bg-white text-gray-800 w-full"
                    : "text-white hover:bg-white hover:text-black hover:bg-opacity-10"
                }`
              }
            >
              Certification
            </NavLink>
          </div>

          {/* Logout Button */}
          <div className="mt-auto p-3 md:p-2 pb-6">
            <button
              className="font-medium flex items-center gap-4 cursor-pointer p-3 md:p-2 w-full text-white rounded-md hover:bg-white hover:text-black transition-colors"
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;