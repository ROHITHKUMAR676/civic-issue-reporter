import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});


const getIcon = (status) => {
  let color = "blue";

  if (status === "Pending") color = "orange";
  if (status === "Approved") color = "blue";
  if (status === "In Progress") color = "violet";
  if (status === "Completed") color = "green";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

function AdminMap({ issues }) {

  const defaultCenter = [13.067439, 80.27847];

 return (
  <div className="mt-6">

    {/* TITLE */}
    <div className="mb-4 px-1 sm:px-2">
      <h2 className="text-lg sm:text-2xl font-semibold text-white">
        Issue Map Overview
      </h2>
      <p className="text-xs sm:text-sm text-slate-400">
        Visual distribution of reported civic issues
      </p>
    </div>

    {/* MAP CARD */}
    <div
      className="
        rounded-2xl sm:rounded-3xl
        overflow-hidden
        border border-white/10
        shadow-xl
      "
    >
     
      <MapContainer
        center={defaultCenter}
        zoom={5}
        className="w-full h-[320px] sm:h-[450px]"
      >

        {/* DARK MAP */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* MARKERS */}
        {issues.map((issue) => {

          if (!issue.location?.coordinates) return null;

          const [lng, lat] = issue.location.coordinates;

          return (
            <Marker
              key={issue._id}
              position={[lat, lng]}
              icon={getIcon(issue.status)}
            >

              <Popup>

                <div className="text-slate-900 w-48">

                  <h3 className="font-semibold text-sm mb-1">
                    {issue.title}
                  </h3>

                  <p className="text-xs">
                    Status: {issue.status}
                  </p>

                  <p className="text-xs">
                    📍 {issue.location?.address || "No address"}
                  </p>

                  <p className="text-xs mt-1">
                    🔥 Upvotes: {issue.upvotes || 0}
                  </p>

                </div>

              </Popup>

            </Marker>
          );
        })}

      </MapContainer>

    </div>

  </div>
);
}

export default AdminMap;
