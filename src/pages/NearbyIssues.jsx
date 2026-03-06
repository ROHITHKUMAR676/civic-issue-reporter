import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { HiArrowUp } from "react-icons/hi";
import axios from "axios";
import { useEffect, useState } from "react";

/////////////////////////////
// ⭐ BEAUTIFUL CUSTOM PINS
/////////////////////////////

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [28, 46], // slightly bigger
    iconAnchor: [14, 46],
    popupAnchor: [0, -40],
  });

const redIcon = createIcon("red");       // High importance
const orangeIcon = createIcon("orange"); // Medium
const greenIcon = createIcon("green");   // Low

export default function NearbyIssues() {

  const [issues, setIssues] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

////////////////////////////////////////////////////
// ⭐ FETCH NEARBY ISSUES
////////////////////////////////////////////////////

  useEffect(() => {

    const fetchNearbyIssues = async () => {

      try {

        const lat = localStorage.getItem("userLat");
        const lng = localStorage.getItem("userLng");

        if (!lat || !lng) return;

        const parsedLocation = [parseFloat(lat), parseFloat(lng)];

        setUserLocation(parsedLocation);

        const res = await axios.get(
          `http://localhost:5000/api/issues/nearby?lat=${lat}&lng=${lng}`
        );

        setIssues(res.data);

      } catch (err) {
        console.log("Error fetching nearby issues", err);
      }
    };

    fetchNearbyIssues();

  }, []);

////////////////////////////////////////////////////
// ⭐ UPVOTE
////////////////////////////////////////////////////

  const handleUpvote = async (issueId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/issues/${issueId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // instant update
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? res.data : issue
        )
      );

    } catch (err) {

      alert(
        err.response?.data?.message || "Already upvoted!"
      );
    }
  };

////////////////////////////////////////////////////
// ⭐ ICON LOGIC
////////////////////////////////////////////////////

  const getIcon = (upvotes) => {

    if (upvotes >= 10) return redIcon;
    if (upvotes >= 5) return orangeIcon;
    return greenIcon;
  };

////////////////////////////////////////////////////
// ⭐ LOADING STATE (PRO FEEL)
////////////////////////////////////////////////////

  if (!userLocation) {

    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white text-xl">
        Detecting your location...
      </div>
    );
  }

////////////////////////////////////////////////////
// ⭐ UI
////////////////////////////////////////////////////

  return (
  <div className="relative h-screen w-screen">

    {/* ================= HEADER ================= */}
    <div
      className="
      absolute
      top-3 sm:top-5
      left-1/2
      -translate-x-1/2
      z-[1000]
      w-[90%] sm:w-auto
      max-w-md
      bg-slate-900/80 backdrop-blur-xl
      px-5 sm:px-8
      py-3 sm:py-4
      rounded-2xl
      shadow-2xl
      border border-white/10
      text-white
      text-center
      "
    >
      <h1 className="text-base sm:text-xl font-semibold">
        Nearby Civic Issues
      </h1>

      <p className="text-xs sm:text-sm text-gray-400">
        Community-powered problem detection
      </p>
    </div>


    {/* ================= BACK BUTTON ================= */}
    <button
      onClick={() => window.history.back()}
      className="
      absolute
      top-3 sm:top-5
      right-3 sm:right-5
      z-[1000]
      bg-indigo-600 hover:bg-indigo-700
      text-white
      px-3 sm:px-5
      py-2
      text-sm sm:text-base
      rounded-xl
      shadow-lg
      transition
      hover:scale-105
      "
    >
      Back
    </button>


    {/* ================= MAP ================= */}
    <MapContainer
      center={userLocation}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >

      {/* Dark Theme Map */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />


      {/* USER LOCATION GLOW */}
      <Circle
        center={userLocation}
        radius={200}
        pathOptions={{
          color: "#6366f1",
          fillColor: "#6366f1",
          fillOpacity: 0.15,
        }}
      />


      {/* USER LOCATION MARKER */}
      <Marker position={userLocation}>
        <Popup
          offset={[0,80]}
          autoPan
          keepInView
          autoPanPaddingTopLeft={[0,120]}
        >
          You are here 📍
        </Popup>
      </Marker>


      {/* ================= ISSUE MARKERS ================= */}
      <MarkerClusterGroup>

        {issues.map((issue) => {

          const lat = issue.location.coordinates[1];
          const lng = issue.location.coordinates[0];

          return (
            <Marker
              key={issue._id}
              position={[lat, lng]}
              icon={getIcon(issue.upvotes)}
            >

              <Popup
                offset={[0,90]}
                autoPan
                keepInView
                autoPanPaddingTopLeft={[0,120]}
                autoPanPaddingBottomRight={[0,20]}
                maxWidth={260}
              >

                {/* ISSUE CARD */}
                <div className="w-56 sm:w-64">

                  <img
                    src={issue.imageUrl}
                    alt=""
                    className="
                    rounded-xl
                    mb-3
                    h-28 sm:h-32
                    w-full
                    object-cover
                    "
                  />

                  <h2 className="font-bold text-sm sm:text-lg mb-1">
                    {issue.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    {issue.description}
                  </p>

                  <div className="flex justify-between items-center">

                    {/* Status Badge */}
                    <span
                      className="
                      text-[10px] sm:text-xs
                      px-2 py-1
                      rounded-md
                      bg-indigo-600
                      text-white
                      "
                    >
                      REPORTED
                    </span>


                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvote(issue._id)}
                      className="
                      flex items-center gap-1
                      bg-indigo-600 hover:bg-indigo-700
                      text-white
                      px-2 sm:px-3
                      py-1
                      rounded-lg
                      text-xs sm:text-sm
                      transition
                      transform hover:scale-110
                      "
                    >
                      <HiArrowUp />
                      {issue.upvotes}
                    </button>

                  </div>

                </div>

              </Popup>

            </Marker>
          );
        })}

      </MarkerClusterGroup>

    </MapContainer>

  </div>
);
}
