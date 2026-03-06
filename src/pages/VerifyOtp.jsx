import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const inputs = useRef([]);

  // countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const t = setTimeout(()=>setTimer(timer-1),1000);
    return ()=>clearTimeout(t);
  },[timer]);

  // auto focus next box
  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index+1].focus();
    }
  };

  // backspace focus previous
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index>0){
      inputs.current[index-1].focus();
    }
  };

  // verify OTP
  const handleVerify = async () => {

    const finalOtp = otp.join("");

    try {

      await axios.post("https://civic-issue-reporter-c7du.onrender.com/api/verify-otp",{
        email,
        otp: finalOtp
      });

      alert("Email verified!");
      navigate("/user");

    } catch(err){
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  // resend OTP
  const handleResend = async () => {

    try {

      await axios.post("https://civic-issue-reporter-c7du.onrender.com/api/resend-otp",{ email });

      alert("New OTP sent!");
      setTimer(30);
      setError("");

    } catch(err){
      setError("Failed to resend OTP");
    }
  };

  return (
  <div className="
    min-h-screen
    flex items-center justify-center
    px-4
    bg-gradient-to-br
    from-indigo-900
    via-slate-900
    to-black
  ">

    {/* CARD */}
    <div className="
      w-full max-w-md
      backdrop-blur-lg
      bg-white/10
      border border-white/20
      shadow-2xl
      rounded-2xl
      p-6 sm:p-8
      text-center
    ">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-white mb-2">
        Verify Your Email ✅
      </h2>

      <p className="text-gray-300 text-sm mb-6">
        OTP sent to <br />
        <span className="text-indigo-400 font-medium">
          {email}
        </span>
      </p>

      {/* OTP INPUTS */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-5">

        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            value={data}
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
            maxLength="1"
            className="
              w-10 h-12 sm:w-12 sm:h-14
              text-center
              text-lg font-semibold
              rounded-lg
              bg-white/20
              text-white
              border border-white/20
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              transition
            "
          />
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-sm mb-3">
          {error}
        </p>
      )}

      {/* VERIFY BUTTON */}
      <button
        onClick={handleVerify}
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
        Verify OTP
      </button>

      {/* TIMER / RESEND */}
      {timer > 0 ? (
        <p className="text-gray-400 mt-4 text-sm">
          Resend available in{" "}
          <span className="text-indigo-400">
            {timer}s
          </span>
        </p>
      ) : (
        <button
          onClick={handleResend}
          className="
            text-indigo-400
            mt-4
            hover:underline
            text-sm
          "
        >
          Resend OTP
        </button>
      )}

    </div>
  </div>
);
}