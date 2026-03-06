import { useState, useEffect } from "react";
import LocationModal from "../components/LocationModal";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { HiOutlineMap } from "react-icons/hi";
import { HiBell } from "react-icons/hi";
import axios from "axios";

export default function UserDashboard() {

  const navigate = useNavigate();

  // ⭐ IMPORTANT CHANGE
  const [showLocation, setShowLocation] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [latestIssue, setLatestIssue] = useState(null);
  /* ⭐ STATUS STEPS */
const steps = [
  "Pending",
  "Approved",
  "In Progress",
  "Pending Verification",
  "Completed"
];

const currentStep = latestIssue
  ? steps.indexOf(latestIssue.status)
  : -1;

/* ✅ CHECK LOCATION PERMISSION ONLY ONCE */
useEffect(() => {

  const locationAllowed = localStorage.getItem("locationAllowed");

  if (!locationAllowed) {
    setShowLocation(true);
  }

}, []);


useEffect(() => {

  const fetchLatest = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/issues/my-latest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLatestIssue(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  fetchLatest();

}, []);


/* ✅ FETCH USER */
useEffect(() => {

  const fetchUser = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserName(res.data.name);
      setUserEmail(res.data.email);

    } catch (err) {

      localStorage.removeItem("token");
      navigate("/");
    }
  };

  fetchUser();

}, []);




/* ✅ SAFE LOGOUT */
const handleLogout = () => {

  localStorage.removeItem("token");

  // ⭐ ALSO CLEAR LOCATION
  localStorage.removeItem("locationAllowed");
  localStorage.removeItem("userLat");
  localStorage.removeItem("userLng");

  navigate("/");

};




 return (
  <>
    {/* DASHBOARD */}
    <div
      className={
        showLocation
          ? "blur-sm pointer-events-none select-none"
          : ""
      }
    >
      <div className="min-h-screen bg-slate-950 text-white">

        {/* ================= NAVBAR ================= */}
        <div className="
          flex flex-col sm:flex-row
          sm:justify-between
          sm:items-center
          gap-4
          px-5 py-4
          border-b border-white/10
        ">
          <h1 className="text-xl sm:text-2xl font-bold">
            CivicAI
          </h1>

          <div className="
            flex items-center
            justify-between
            sm:justify-end
            gap-5
            text-sm sm:text-base
          ">
            <button className="hover:text-indigo-400">
              Dashboard
            </button>

            <button
              onClick={() => navigate("/account")}
              className="hover:text-indigo-400"
            >
              Account
            </button>

            <button
              onClick={() => navigate("/inbox")}
              className="relative"
            >
              <HiBell size={22} />
              <span className="absolute -top-1 -right-2 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>

            <button
              onClick={handleLogout}
              className="
              bg-indigo-600
              px-3 py-2
              rounded-lg
              text-sm
              active:scale-95
              "
            >
              Logout
            </button>
          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="px-5 sm:px-10 py-8">

          {/* HERO */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2">
              Welcome back, {userName} 👋
            </h2>

            <p className="text-gray-400 text-sm sm:text-base">
              Signed in as{" "}
              <span className="text-indigo-400">
                {userEmail}
              </span>
            </p>
          </div>

          <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl mb-10 border border-white/5">

  <h3 className="text-lg sm:text-xl mb-6 font-semibold">
    Complaint Status
  </h3>

  {latestIssue ? (

    <>
      {/* DESKTOP TRACKER */}
      <div className="hidden sm:block relative">

        <div className="absolute top-6 left-0 w-full h-1 bg-slate-700"></div>

        <div
          className="absolute top-6 left-0 h-1 bg-green-500 transition-all"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`
          }}
        />

        <div className="flex justify-between relative">

          {steps.map((step, i) => {

            const completed = i <= currentStep;

            return (
              <div key={i} className="flex flex-col items-center">

                <div
                  className={`w-12 h-12 flex items-center justify-center
                  rounded-full font-bold z-10
                  ${completed ? "bg-green-500" : "bg-slate-700"}`}
                >
                  {i + 1}
                </div>

                <p
                  className={`mt-2 text-sm text-center
                  ${completed ? "text-green-400" : "text-gray-400"}`}
                >
                  {step}
                </p>

              </div>
            );
          })}
        </div>

      </div>


      <div className="sm:hidden flex flex-col">

  {steps.map((step, i) => {

    const completed = i <= currentStep;
    const lineCompleted = i < currentStep;

    return (

      <div key={i} className="flex items-start gap-3 relative pb-6">

        {/* Vertical progress line */}
        {i !== steps.length - 1 && (
          <div
            className={`absolute left-4 top-8 w-[2px] h-full 
            ${lineCompleted ? "bg-green-500" : "bg-slate-700"}`}
          />
        )}

        {/* Circle */}
        <div
          className={`w-8 h-8 flex items-center justify-center
          rounded-full text-sm font-bold z-10
          ${completed ? "bg-green-500" : "bg-slate-700"}`}
        >
          {i + 1}
        </div>

        {/* Step text */}
        <p
          className={`text-sm mt-1
          ${completed ? "text-green-400" : "text-gray-400"}`}
        >
          {step}
        </p>

      </div>

    );
  })}

</div>

    </>

  ) : (

    <p className="text-gray-400">
      No complaints submitted yet
    </p>

  )}

</div>

          {/* ================= ACTION CARDS ================= */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          ">
            {/* REPORT */}
            <div
              onClick={() => navigate("/report")}
              className="
              bg-gradient-to-br
              from-indigo-600
              to-indigo-800
              p-6 sm:p-8
              rounded-2xl
              cursor-pointer
              active:scale-95
              transition
              shadow-xl
            ">
              <HiOutlineExclamationCircle size={36} />

              <h3 className="text-xl sm:text-2xl mt-4 font-semibold">
                Report an Issue
              </h3>

              <p className="text-indigo-200 mt-2 text-sm">
                Notify authorities about civic problems instantly.
              </p>
            </div>

            {/* COMMUNITY */}
            <div
              onClick={() => navigate("/nearby")}
              className="
              bg-slate-900
              border border-white/5
              p-6 sm:p-8
              rounded-2xl
              cursor-pointer
              active:scale-95
              transition
              shadow-xl
            ">
              <HiOutlineMap
                size={36}
                className="text-indigo-400"
              />

              <h3 className="text-xl sm:text-2xl mt-4 font-semibold">
                Community Issues
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                Explore problems near your location.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* LOCATION MODAL */}
    {showLocation && (
      <LocationModal
        onAllow={() => {
          localStorage.setItem("locationAllowed", "true");
          setShowLocation(false);
        }}
      />
    )}
  </>
);
}
