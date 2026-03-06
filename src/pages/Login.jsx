import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Lottie from "lottie-react";
import cityAnimation from "../assets/city.json";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed } from "react-icons/hi";
import axios from "axios";



export default function Login() {
  const navigate = useNavigate();

  const [animationDone, setAnimationDone] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 LOGIN FUNCTION
  // 🔥 LOGIN FUNCTION
const handleLogin = async () => {
  try {
    setError("");
    setLoading(true);

    const res = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    });

    // ⭐ Save token (VERY IMPORTANT — used later for protected routes)
    localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.role);


    if (res.data.role === "admin") {
  navigate("/admin");
} 
else if (res.data.role === "dept") {
  navigate("/dept");
} 
else {
  navigate("/user");
}


  } catch (err) {
    setError(
      err.response?.data?.message || "Invalid email or password"
    );
  }

  setLoading(false);
};


  // 🔥 ENTER KEY LOGIN
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
  <div
    className="
    relative min-h-screen flex items-center justify-center
    overflow-hidden px-4
    bg-gradient-to-br from-indigo-900 via-slate-900 to-black
  "
  >
    {/* Background Animation */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Lottie
        animationData={cityAnimation}
        loop={false}
        autoplay
        onComplete={() => setAnimationDone(true)}
        style={{
          width: window.innerWidth < 640 ? "600px" : "1250px",
          filter: "invert(1) brightness(2)",
          opacity: 0.12,
        }}
      />
    </div>

    {animationDone && (
      <div
        className="
        relative z-10
        w-full max-w-md
        p-6 sm:p-8
        rounded-2xl
        backdrop-blur-lg
        bg-white/10
        border border-white/20
        shadow-2xl
        animate-fadeUp
      "
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          CivicAI 🚀
        </h1>

        <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
          Smart Civic Issue Reporting Platform
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="flex items-center bg-white/20 rounded-lg px-3 py-3 mb-4">
          <HiMail className="text-white mr-2 text-lg" />
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent outline-none text-white w-full text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-white/20 rounded-lg px-3 py-3 mb-6">
          <HiLockClosed className="text-white mr-2 text-lg" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-white w-full text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Login Button */}
        <button
          className="
          w-full py-3 rounded-lg font-semibold
          bg-indigo-600 hover:bg-indigo-700
          active:scale-95
          transition text-white
          "
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-500"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-500"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={() => {
            window.location.href =
              "http://localhost:5000/api/auth/google";
          }}
          className="
          w-full flex items-center justify-center gap-2
          bg-white text-gray-800 py-3
          rounded-lg
          active:scale-95
          transition
          "
        >
          <FcGoogle size={22} />
          Sign in with Google
        </button>

        {/* Register */}
        <p className="text-gray-300 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    )}
  </div>
);
}
