import { useState } from "react";
import axios from "axios";
import {
  HiOutlineCamera,
  HiOutlineMicrophone,
  HiOutlineLocationMarker,
  HiX,
} from "react-icons/hi";

export default function ReportIssue() {

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // 🎤 VOICE TO TEXT
  const startVoice = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // append speech to description
      setDescription(prev => prev + " " + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // 📍 DETECT LOCATION
  const detectLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        alert("Location captured successfully!");
      },
      () => alert("Location permission denied")
    );
  };

  // 🚀 OPEN MODAL
  const handleSubmit = () => {

    if (!description.trim()) {
      alert("Please describe the issue");
      return;
    }

    if (!image) {
      alert("Please upload an image");
      return;
    }

    if (!location) {
      alert("Please detect location");
      return;
    }

    setShowModal(true);
  };

  
 const handleFinalSubmit = async () => {

  try {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    // ⭐ Create form data (VERY IMPORTANT for image upload)
    const formData = new FormData();

    formData.append("title", description.substring(0, 20)); 
    // small trick → first 20 chars as title

    formData.append("description", description);
    formData.append("image", image);

    formData.append("lat", location.lat);
    formData.append("lng", location.lng);

    formData.append(
      "address",
      `${userDetails.address}, ${userDetails.city}, ${userDetails.pincode}`
    );

    // ⭐ THIS IS WHERE TOKEN GOES
    await axios.post(
      "http://localhost:5000/api/issues/report",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("🔥 Complaint Submitted Successfully!");

    setShowModal(false);
    setImage(null);
    setDescription("");
    setLocation(null);

  } catch (error) {

    console.error("UPLOAD ERROR:", error);
    alert("Error submitting complaint");

  }
};
 return (
<>
{/* NAVBAR */}
<div className="w-full border-b border-white/10 bg-slate-950 px-6 py-4 flex items-center justify-between">

  <h1 className="text-xl font-bold text-white">
    CivicAI
  </h1>

  <button
    onClick={() => window.history.back()}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
  >
    Back
  </button>

</div>


{/* PAGE */}
<div
className={`
min-h-screen
bg-gradient-to-br
from-slate-950 via-indigo-950 to-slate-900
flex items-start md:items-center
justify-center
px-4 py-8
${showModal ? "blur-sm pointer-events-none" : ""}
`}
>

<div
className="
w-full max-w-5xl
bg-white/5 backdrop-blur-xl
border border-white/10
rounded-3xl shadow-2xl
p-6 md:p-10
"
>

{/* HEADER */}
<div className="mb-8">

<h1 className="text-3xl font-bold text-white">
Report a Civic Issue 🚨
</h1>

<p className="text-gray-400 mt-1">
Takes less than 30 seconds.
</p>

</div>


{/* GRID LAYOUT */}
<div className="grid md:grid-cols-2 gap-10 items-start">

{/* IMAGE UPLOAD */}
<label
className="
relative flex flex-col items-center justify-center
h-72
border-2 border-dashed border-indigo-400/40
rounded-2xl cursor-pointer
hover:bg-indigo-500/10 transition
"
>

{image ? (
<img
src={URL.createObjectURL(image)}
alt="preview"
className="h-full w-full object-cover rounded-2xl"
/>
) : (
<>
<HiOutlineCamera size={42} className="text-indigo-400 mb-3"/>

<span className="text-gray-300 font-medium">
Upload Issue Photo
</span>

<span className="text-gray-500 text-sm mt-1">
Tap to capture
</span>
</>
)}

<input
type="file"
hidden
onChange={(e)=>setImage(e.target.files[0])}
/>

</label>


{/* FORM SIDE */}
<div className="flex flex-col">

<label className="text-gray-300 mb-2">
Description
</label>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Explain the issue clearly..."
className="
p-4
h-36
rounded-xl
bg-slate-900
text-white
border border-white/10
focus:border-indigo-500
outline-none
resize-none
"
/>


{/* BUTTONS */}
<div className="flex gap-4 mt-6 flex-wrap">

<button
onClick={startVoice}
className={`
flex items-center gap-2 px-5 py-3 rounded-xl
text-white transition
${isListening
? "bg-red-600 animate-pulse"
: "bg-indigo-600 hover:bg-indigo-700"
}
`}
>
<HiOutlineMicrophone/>
{isListening ? "Listening..." : "Voice Input"}
</button>


<button
onClick={detectLocation}
className="
flex items-center gap-2
bg-slate-800 px-5 py-3 rounded-xl
hover:bg-slate-700 text-white
"
>
<HiOutlineLocationMarker/>
Detect Location
</button>

</div>


{location && (
<p className="text-green-400 text-sm mt-3">
📍 Location captured
</p>
)}


<button
onClick={handleSubmit}
className="
mt-8 py-3
rounded-xl font-semibold
bg-gradient-to-r from-indigo-600 to-purple-600
hover:scale-[1.02] active:scale-[0.98]
transition text-white shadow-lg
"
>
Submit Issue 🚀
</button>

</div>

</div>

</div>

</div>


{/* MODAL */}
{showModal && (
<div className="fixed inset-0 flex items-center justify-center px-4 z-50">

<div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

<div
className="
relative w-full max-w-md
bg-slate-900/95 border border-white/10
rounded-2xl p-6 text-white
max-h-[90vh] overflow-y-auto
"
>

<button
onClick={()=>setShowModal(false)}
className="absolute top-4 right-4 text-gray-400"
>
<HiX size={22}/>
</button>

<h2 className="text-xl font-semibold mb-4">
Confirm Your Details
</h2>

{["name","phone","address","city","pincode"].map((field)=>(
<input
key={field}
placeholder={field.toUpperCase()}
className="
w-full mb-3 p-3 rounded-lg
bg-slate-800 border border-white/10
focus:border-indigo-500 outline-none
"
onChange={(e)=>setUserDetails({
...userDetails,
[field]: e.target.value
})}
/>
))}

<button
onClick={handleFinalSubmit}
className="
w-full mt-4 py-3 rounded-xl
bg-indigo-600 hover:bg-indigo-700
transition font-semibold
"
>
Confirm & Submit ✅
</button>

</div>
</div>
)}

</>
);
}
