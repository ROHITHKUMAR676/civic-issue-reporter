import { useEffect, useState } from "react";
import axios from "axios";
import { Search, X, MapPin, Flame } from "lucide-react";

function AdminIssues() {

  const [issues, setIssues] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [now, setNow] = useState(new Date());

  const token = localStorage.getItem("token");

  //////////////////////////////////////////////////////
  // LIVE TIMER
  //////////////////////////////////////////////////////

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // every minute

    return () => clearInterval(timer);
  }, []);

  //////////////////////////////////////////////////////
  // AI PRIORITY ENGINE
  //////////////////////////////////////////////////////

  const getPriority = (issue) => {

    const text =
      (issue.title + " " + issue.description).toLowerCase();

    const criticalWords = [
      "fire",
      "flood",
      "sewage",
      "collapse",
      "electric shock",
      "gas leak",
    ];

    if (criticalWords.some(word => text.includes(word)))
      return {
        label: "Critical",
        color: "bg-red-600/20 text-red-400",
      };

    if ((issue.upvotes || 0) > 15)
      return {
        label: "High",
        color: "bg-orange-500/20 text-orange-300",
      };

    if (issue.slaDeadline && new Date(issue.slaDeadline) < now)
      return {
        label: "Overdue",
        color: "bg-red-500/20 text-red-300",
      };

    return {
      label: "Normal",
      color: "bg-green-500/20 text-green-300",
    };
  };

  //////////////////////////////////////////////////////
  // SLA
  //////////////////////////////////////////////////////

  const getSLATime = (deadline) => {

    if (!deadline) return "No SLA";

    const diff = new Date(deadline) - now;

    if (diff <= 0) return "OVERDUE";

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hrs}h ${mins}m`;
  };

  //////////////////////////////////////////////////////
  // FETCH
  //////////////////////////////////////////////////////

  const fetchIssues = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/issues",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const sorted = res.data.sort((a, b) => {

      // Priority first
      const priorityOrder = {
        Critical: 3,
        Overdue: 2,
        High: 1,
        Normal: 0,
      };

      const pa = priorityOrder[getPriority(a).label];
      const pb = priorityOrder[getPriority(b).label];

      if (pb !== pa) return pb - pa;

      if ((b.upvotes || 0) !== (a.upvotes || 0))
        return (b.upvotes || 0) - (a.upvotes || 0);

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setIssues(sorted);
    setFiltered(sorted);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  //////////////////////////////////////////////////////
  // SEARCH
  //////////////////////////////////////////////////////

  useEffect(() => {

    const result = issues.filter(issue =>
      issue.title.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);

  }, [search, issues]);

  //////////////////////////////////////////////////////
  // ACTIONS
  //////////////////////////////////////////////////////

  const assignDept = async (id, department) => {

    await axios.put(
      `http://localhost:5000/api/issues/${id}/assign`,
      { department },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchIssues();
    setSelectedIssue(null);
  };



  //////////////////////////////////////////////////////
  // STATUS COLOR
  //////////////////////////////////////////////////////

  const statusColor = (status) => {

    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300";

      case "Approved":
        return "bg-blue-500/20 text-blue-300";

      case "In Progress":
        return "bg-purple-500/20 text-purple-300";

      case "Completed":
        return "bg-green-500/20 text-green-300";

      default:
        return "bg-gray-500/20";
    }
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
  <div className="text-white px-3 sm:px-6 md:px-10">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

      <h1 className="text-2xl sm:text-3xl font-bold">
        Issue Control Center 🎯
      </h1>

      <div className="relative w-full sm:w-auto">

        <Search
          className="absolute top-3 left-3 opacity-60"
          size={18}
        />

        <input
          placeholder="Search issues..."
          className="
            w-full sm:w-64
            bg-white/10
            pl-10 pr-4 py-2
            rounded-xl
            border border-white/10
            focus:border-indigo-400
            outline-none
          "
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

    </div>


    {/* ISSUE ROWS */}

    <div className="space-y-4 sm:space-y-6">

      {filtered.map(issue => {

        const priority = getPriority(issue);

        return (

          <div
            key={issue._id}
            className="
              bg-white/5
              border border-white/10
              rounded-2xl
              p-4 sm:p-5
              flex flex-col sm:flex-row
              gap-4 sm:gap-6
              hover:bg-white/10
              transition
            "
          >

            {/* IMAGE */}
            <img
              src={issue.imageUrl}
              className="
                w-full
                sm:w-28
                h-40 sm:h-28
                object-cover
                rounded-xl
                cursor-pointer
              "
              onClick={()=>setSelectedIssue(issue)}
            />

            {/* CONTENT */}
            <div className="flex-1">

              <h2 className="text-lg sm:text-xl font-semibold">
                {issue.title}
              </h2>

              <p className="text-slate-400 flex items-center gap-2 mt-1 text-sm">
                <MapPin size={14}/>
                {issue.location?.address || "No address"}
              </p>

              <div className="flex gap-2 sm:gap-3 mt-3 flex-wrap">

                <span className={`px-3 py-1 text-xs sm:text-sm rounded-full ${priority.color}`}>
                  🚨 {priority.label}
                </span>

                <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-orange-500/20 text-orange-300 flex items-center gap-1">
                  <Flame size={14}/>
                  {issue.upvotes || 0}
                </span>

                <span className={`px-3 py-1 text-xs sm:text-sm rounded-full ${statusColor(issue.status)}`}>
                  {issue.status}
                </span>

                <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-indigo-500/20 text-indigo-300">
                  {issue.department || "Unassigned"}
                </span>

                <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-slate-700 text-slate-200">
                  ⏳ {getSLATime(issue.slaDeadline)}
                </span>

              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={()=>setSelectedIssue(issue)}
              className="
                bg-indigo-600 hover:bg-indigo-700
                px-4 py-2
                rounded-lg
                h-fit
                w-full sm:w-auto
              "
            >
              Review
            </button>

          </div>

        );
      })}

    </div>



    {/* REVIEW PANEL */}

    {selectedIssue && (

      <div className="
        fixed inset-0
        bg-black/80
        flex justify-center items-center
        z-50
        p-4
      ">

        <div className="
          bg-gradient-to-br
          from-indigo-950
          to-slate-900
          w-full
          max-w-3xl
          rounded-2xl
          shadow-2xl
          flex
          flex-col md:flex-row
          overflow-hidden
          relative
        ">

          <X
            size={26}
            className="absolute right-4 top-4 cursor-pointer"
            onClick={()=>setSelectedIssue(null)}
          />

          {/* IMAGE */}
          <img
            src={selectedIssue.imageUrl}
            className="
              w-full md:w-[45%]
              h-60 md:h-auto
              object-cover
            "
          />

          {/* CONTENT */}
          <div className="p-5 sm:p-6 flex-1 space-y-3 sm:space-y-4">

            <h2 className="text-xl sm:text-2xl font-bold">
              {selectedIssue.title}
            </h2>

            <p className="text-indigo-200 text-sm sm:text-base">
              {selectedIssue.description}
            </p>

            <p className="text-sm text-slate-400">
              📍 {selectedIssue.location?.address}
            </p>

            <p className="text-orange-300 text-sm">
              🔥 {selectedIssue.upvotes || 0} votes
            </p>

            <p className="font-semibold text-sm sm:text-base">
              SLA: {getSLATime(selectedIssue.slaDeadline)}
            </p>


            {!selectedIssue.department && (

              <select
                onChange={(e)=>assignDept(selectedIssue._id, e.target.value)}
                className="
                  w-full
                  bg-slate-800
                  border border-white/10
                  p-3
                  rounded-xl
                "
              >
                <option value="">Assign Department</option>
                <option value="Road">Roads</option>
                <option value="Water">Water</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Electrical">Electrical</option>
              </select>

            )}

            {selectedIssue.department && (

              <div className="bg-indigo-500/20 text-indigo-300 px-4 py-3 rounded-xl text-sm">
                Assigned to {selectedIssue.department} Department
              </div>

            )}

          </div>

        </div>

      </div>

    )}

  </div>
);
}

export default AdminIssues;
