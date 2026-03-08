import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiPencil,
  HiX 
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";



export default function Account() {

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {

  const fetchUser = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        "https://civic-issue-reporter-c7du.onrender.com/api/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(res.data);
      setPhone(res.data.phone || "");

    } catch (err) {

      localStorage.removeItem("token");
      navigate("/");
    }
  };

  fetchUser();

}, []);


const handleSave = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      "https://civic-issue-reporter-c7du.onrender.com/api/update-phone",
      { phone },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserData(res.data);
    setEditing(false);

  } catch (error) {

    console.log(error);
  }

};


// Loader
if (!userData) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
      Loading profile...
    </div>
  );
}


return (
  <div className="min-h-screen bg-gradient-to-br 
  from-slate-950 via-indigo-950 to-slate-900
  flex items-center justify-center px-4 sm:px-6 py-6">

    <div className="relative w-full max-w-3xl 
    bg-white/5 backdrop-blur-2xl
    border border-white/10
    rounded-2xl sm:rounded-3xl shadow-2xl
    p-6 sm:p-10">

      {/* CLOSE */}
      <button
        onClick={() => navigate("/user")}
        className="absolute top-4 right-4 sm:top-6 sm:right-6
        text-gray-400 hover:text-white transition"
      >
        <HiX size={24} />
      </button>


      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          My Profile
        </h2>

        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2
          bg-indigo-600 px-4 py-2 rounded-xl
          hover:bg-indigo-700 transition text-white w-fit"
        >
          <HiPencil />
          {editing ? "Cancel" : "Edit"}
        </button>

      </div>


      {/* PROFILE */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 mb-10">

        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full 
        bg-gradient-to-tr from-indigo-500 to-purple-600
        flex items-center justify-center
        text-3xl sm:text-4xl font-bold text-white shadow-lg">

          {userData.name?.charAt(0).toUpperCase()}

        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            {userData.name}
          </h3>

          <p className="text-gray-400 text-sm sm:text-base">
            {userData.role || "Citizen User"}
          </p>
        </div>

      </div>


      {/* INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

        {/* NAME */}
        <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <HiOutlineUser size={18} />
            <span className="text-sm">Full Name</span>
          </div>

          <p className="text-white text-base sm:text-lg">
            {userData.name}
          </p>
        </div>


        {/* EMAIL */}
        <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <HiOutlineMail size={18} />
            <span className="text-sm">Email Address</span>
          </div>

          <p className="text-white text-base sm:text-lg break-all">
            {userData.email}
          </p>
        </div>


        {/* PHONE */}
        <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <HiOutlinePhone size={18} />
            <span className="text-sm">Phone</span>
          </div>

          {editing ? (

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="bg-slate-800 text-white p-2 rounded-lg w-full outline-none"
            />

          ) : (

            <p className="text-gray-400 text-base sm:text-lg">
              {userData.phone || "Not Added"}
            </p>

          )}

        </div>


        {/* ROLE */}
        <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <HiOutlineUser size={18} />
            <span className="text-sm">Role</span>
          </div>

          <p className="text-white text-base sm:text-lg">
            {userData.role || "Citizen User"}
          </p>
        </div>

      </div>


      {/* SAVE BUTTON */}
      {editing && (

        <button
          onClick={handleSave}
          className="mt-6 sm:mt-8 w-full bg-green-600 py-3 rounded-xl
          hover:bg-green-700 transition text-white font-semibold"
        >
          Save Changes
        </button>

      )}

    </div>
  </div>
);
}
