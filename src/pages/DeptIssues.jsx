import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DeptIssues() {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/issues/dept/issues",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIssues(res.data);

      // refresh drawer issue also
      if (selectedIssue) {
        const updated = res.data.find(i => i._id === selectedIssue._id);
        if (updated) setSelectedIssue(updated);
      }

    } catch (err) {
      console.error("Failed to load issues", err);
    }
  };

  /* ---------- START WORK ---------- */
  const startWork = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/issues/dept/issues/${id}/status`,
        { status: "In Progress" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Work started");

      await fetchIssues();

    } catch (err) {
      console.log(err);
    }
  };

  /* ---------- UPLOAD PROOF ---------- */
  const uploadProof = async (file, id) => {

    const formData = new FormData();
    formData.append("image", file);

    try {

      const res = await axios.put(
        `http://localhost:5000/api/issues/dept/issues/${id}/proof`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Proof uploaded");

      await fetchIssues();

    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  /* ---------- SEND FOR VERIFICATION ---------- */
  const sendForVerification = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/issues/dept/issues/${id}/status`,
        { status: "Pending Verification" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Sent to admin for verification");

      await fetchIssues();

    } catch (err) {
      console.error("Completion failed", err);
    }
  };

  const openIssue = (issue) => {
    setSelectedIssue(issue);
  };

 return (

  <div className="space-y-6 px-3 sm:px-6 md:px-10">

    {/* HEADER */}
    <h2 className="text-2xl sm:text-3xl font-bold">
      Department Issues
    </h2>



    {/* ISSUE CARDS */}
    {issues.map((issue) => (

      <div
        key={issue._id}
        onClick={() => openIssue(issue)}
        className="
          cursor-pointer
          bg-gradient-to-b from-[#1e293b] to-[#020617]
          border border-slate-700/40
          rounded-2xl sm:rounded-3xl
          p-4 sm:p-6
          shadow-xl
          flex flex-col sm:flex-row
          gap-4 sm:gap-6
          hover:scale-[1.01]
          transition
        "
      >

        {/* IMAGE */}
        <img
          src={issue.imageUrl}
          alt="issue"
          className="
            h-40
            sm:h-40
            w-full sm:w-56
            object-cover
            rounded-xl
          "
        />

        {/* CONTENT */}
        <div className="space-y-2">

          <h3 className="text-lg sm:text-xl font-semibold">
            {issue.title}
          </h3>

          <p className="text-slate-400 text-xs sm:text-sm">
            {issue.location?.address}
          </p>

          <div className="text-indigo-400 text-xs sm:text-sm">
            Status: {issue.status}
          </div>

        </div>

      </div>

    ))}



{/* ================= DRAWER ================= */}

{selectedIssue && (

<div className="fixed inset-0 z-50 flex">

  {/* OVERLAY */}
  <div
    className="flex-1 bg-black/50"
    onClick={() => setSelectedIssue(null)}
  />



  {/* DRAWER */}
  <div className="
    w-full sm:w-[450px] md:w-[550px]
    bg-[#020617]
    h-full
    p-4 sm:p-6
    overflow-y-auto
  ">

    <button
      onClick={() => setSelectedIssue(null)}
      className="text-slate-400 mb-4"
    >
      ✕ Close
    </button>



    {/* TITLE */}
    <h2 className="text-xl sm:text-2xl font-bold mb-4">
      {selectedIssue.title}
    </h2>



    {/* ISSUE IMAGE */}
    <img
      src={selectedIssue.imageUrl}
      alt="issue"
      className="
        rounded-xl
        h-48 sm:h-56
        w-full
        object-cover
        mb-4
      "
    />



    {/* MAP */}
    {selectedIssue.location?.coordinates && (

      <div className="
        h-40 sm:h-44
        rounded-xl
        overflow-hidden
        mb-4
      ">

        <MapContainer
          center={[
            selectedIssue.location.coordinates[1],
            selectedIssue.location.coordinates[0],
          ]}
          zoom={15}
          className="h-full w-full"
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker
            position={[
              selectedIssue.location.coordinates[1],
              selectedIssue.location.coordinates[0],
            ]}
          >
            <Popup>{selectedIssue.title}</Popup>
          </Marker>

        </MapContainer>

      </div>

    )}



    {/* DEPT PROOF */}
    {selectedIssue.departmentProofImage && (

      <div className="mb-4">

        <p className="text-xs sm:text-sm text-slate-400 mb-2">
          Department Proof
        </p>

        <img
          src={selectedIssue.departmentProofImage}
          alt="proof"
          className="
            h-36 sm:h-40
            rounded-xl
            object-cover
            w-full
          "
        />

      </div>

    )}



    {/* ACTIONS */}
    <div className="
      flex flex-col sm:flex-row
      gap-3
      mt-4
    ">

      {selectedIssue.status === "Approved" && (

        <button
          onClick={() => startWork(selectedIssue._id)}
          className="
            bg-yellow-500 hover:bg-yellow-600
            px-4 py-2
            rounded-lg
            font-semibold
            text-sm
          "
        >
          Start Work
        </button>

      )}

      {selectedIssue.status === "In Progress" &&
        !selectedIssue.departmentProofImage && (

        <label className="
          bg-indigo-600 hover:bg-indigo-700
          px-4 py-2
          rounded-lg
          font-semibold
          cursor-pointer
          text-sm
        ">

          Upload Proof

          <input
            type="file"
            hidden
            onChange={(e) =>
              uploadProof(
                e.target.files[0],
                selectedIssue._id
              )
            }
          />

        </label>

      )}

      {selectedIssue.departmentProofImage &&
        selectedIssue.status !== "Completed" && (

        <button
          onClick={() =>
            sendForVerification(selectedIssue._id)
          }
          className="
            bg-green-600 hover:bg-green-700
            px-4 py-2
            rounded-lg
            font-semibold
            text-sm
          "
        >
          Send For Verification
        </button>

      )}

      {selectedIssue.status === "Completed" && (

        <div className="text-green-400 font-bold text-sm">
          ✅ Completed by Admin
        </div>

      )}

    </div>

  </div>

</div>

)}

  </div>
);
}

export default DeptIssues;
