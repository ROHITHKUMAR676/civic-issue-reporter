import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import cityAnimation from "../assets/city.json";
import { FcGoogle } from "react-icons/fc";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import { useState } from "react"; // ⭐ NEW

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 REGISTER FUNCTION (NOW TALKS TO NODE)
  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "https://civic-issue-reporter-c7du.onrender.com/api/register",
        {
          name,
          email,
          password,
        }
      );

      // ✅ success
      alert(res.data.message);

      // ⭐ Move to login page after register
      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ENTER KEY
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

 return (
  <div
    className="
    relative min-h-screen
    flex items-center justify-center
    overflow-hidden
    px-4
    bg-gradient-to-br
    from-indigo-900 via-slate-900 to-black
  "
  >
    {/* BACKGROUND ANIMATION */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Lottie
        animationData={cityAnimation}
        autoplay={false}
        loop={false}
        style={{
          width:
            window.innerWidth < 640
              ? "600px"
              : "1200px",
          filter: "invert(1) brightness(2)",
          opacity: 0.08,
        }}
      />
    </div>

    {/* REGISTER CARD */}
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
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
        CivicAI 🚀
      </h1>

      <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
        Create your smart civic account
      </p>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/20 text-red-300 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {/* NAME */}
      <div className="flex items-center bg-white/20 rounded-lg px-3 py-3 mb-4">
        <HiUser className="text-white mr-2 text-lg" />
        <input
          type="text"
          placeholder="Full Name"
          className="bg-transparent outline-none text-white w-full text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      {/* EMAIL */}
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

      {/* PASSWORD */}
      <div className="flex items-center bg-white/20 rounded-lg px-3 py-3 mb-6">
        <HiLockClosed className="text-white mr-2 text-lg" />
        <input
          type="password"
          placeholder="Password"
          className="bg-transparent outline-none text-white w-full text-sm"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={handleKeyPress}
        />
      </div>

      {/* REGISTER BUTTON */}
      <button
        onClick={handleRegister}
        className="
        w-full py-3
        rounded-lg
        font-semibold
        bg-indigo-600
        hover:bg-indigo-700
        active:scale-95
        transition
        text-white
      "
      >
        {loading
          ? "Creating Account..."
          : "Register"}
      </button>

      {/* DIVIDER */}
      <div className="flex items-center my-5">
        <div className="flex-grow h-px bg-gray-500"></div>
        <span className="px-3 text-gray-400 text-sm">
          OR
        </span>
        <div className="flex-grow h-px bg-gray-500"></div>
      </div>

      {/* GOOGLE */}
      <button
        className="
        w-full flex items-center justify-center gap-2
        bg-white text-gray-800
        py-3 rounded-lg
        active:scale-95
        transition
      "
      >
        <FcGoogle size={22} />
        Sign up with Google
      </button>

      {/* LOGIN */}
      <p className="text-gray-300 text-sm text-center mt-6">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          className="text-indigo-400 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  </div>
);
}
