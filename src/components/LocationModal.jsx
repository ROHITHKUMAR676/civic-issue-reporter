import { useEffect } from "react";
import { HiLocationMarker } from "react-icons/hi";

export default function LocationModal({ onAllow }) {

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
  (position) => {
    localStorage.setItem("locationAllowed", "true");
    localStorage.setItem("userLat", position.coords.latitude);
    localStorage.setItem("userLng", position.coords.longitude);
    onAllow();
  },
  () => {
    alert("Location permission denied");
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      {/* MODAL */}
      <div className="relative bg-slate-900 text-white
      p-8 rounded-2xl w-[90%] max-w-md
      border border-white/10 shadow-2xl
      animate-fadeIn">

        <div className="flex flex-col items-center text-center">

          <div className="bg-indigo-600/20 p-4 rounded-full mb-4">
            <HiLocationMarker size={40} className="text-indigo-400"/>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Enable Location
          </h2>

          <p className="text-gray-400 mb-6">
            We use your location to show nearby civic issues
            and provide faster complaint resolution.
          </p>

          <button
            onClick={requestLocation}
            className="
            w-full py-3 rounded-lg
            bg-indigo-600 hover:bg-indigo-700
            transition duration-300 font-semibold"
          >
            Allow Location
          </button>

        </div>
      </div>
    </div>
  );
}
