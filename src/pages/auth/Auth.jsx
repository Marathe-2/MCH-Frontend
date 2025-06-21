import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { login, register } from "../../services";
import { toast } from "react-toastify";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    phone: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    if (isLogin) {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value,
      });
    } else {
      setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const res = await login(loginData);
        const access_token = res.data.access;
        const refresh_token = res.data.refresh;
        const username = res.data.user.username;
        const email = res.data.user.email;
        const first_name = res.data.user.first_name;
        const last_name = res.data.user.last_name;
        const user_id = res.data.user.id;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("username", username);
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("last_name", last_name);
        localStorage.setItem("email", email);
        localStorage.setItem("user_id", user_id);
      } catch (error) {
        console.log(error);
      }

      navigate("/overview");
    } else {
      try {
        const res = await register(registerData);
        toast.success("User Registered Successfully");
        setIsLogin(true);
        setRegisterData({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          phone: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 border border-gray-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your account to continue" : "Get started"}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="first_name"
                  value={registerData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="First name"
                  required={!isLogin}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="last_name"
                  value={registerData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="First name"
                  required={!isLogin}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={registerData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="First name"
                  required={!isLogin}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="employee@company.com"
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile
                </label>

                <input
                  type="tel"
                  id="mobile"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mobile "
                  required
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="email"
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="employee_company"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </>
          )}

          {/* {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#f87171] hover:text-[#f87171] transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )} */}

          <button
            type="submit"
            className="w-full bg-[#b90d0d] text-white py-2 px-4 rounded-lg hover:bg-[#b90d0d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {!isLogin && (
          <p className="mt-6 text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <button className="text-[#b90d0d] hover:text-[#b90d0d] underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-[#b90d0d] hover:text-[#b90d0d] underline">
              Privacy Policy
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
