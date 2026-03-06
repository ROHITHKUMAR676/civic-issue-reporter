import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DeptDashboard() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    verification: 0,
    completed: 0,
  });

  const [issues, setIssues] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // ✅ Fetch stats + issues together
        const [statsRes, issuesRes] = await Promise.all([
          axios.get("https://civic-issue-reporter-c7du.onrender.com/api/issues/dept/stats", { headers }),
          axios.get("https://civic-issue-reporter-c7du.onrender.com/api/issues/dept/issues", { headers }),
        ]);

        setStats(statsRes.data);

        // Only preview first 4 issues
        setIssues(issuesRes.data.slice(0, 4));

      } catch (err) {
        console.error("Dept dashboard error:", err);
      }
    };

    fetchData();

  }, [token]);


  // ✅ SLA Helper
  const getSLA = (deadline) => {
    if (!deadline) return "No SLA";

    const diff = new Date(deadline) - new Date();

    if (diff <= 0) return "⚠️ Overdue";

    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) return `⏳ ${hours} hrs left`;

    const days = Math.floor(hours / 24);

    return `🗓️ ${days} days left`;
  };


 return (
  <div className="space-y-8 px-3 sm:px-6 md:px-8">

    {/* HEADER */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold">
        Department Command Center
      </h2>

      <p className="text-slate-400 mt-1 text-sm sm:text-base">
        Track, prioritize and resolve civic issues assigned to your department.
      </p>
    </div>


    {/* ================= STATS ================= */}

    <div
      className="
      bg-[#1e293b]
      rounded-2xl
      p-4 sm:p-6
      grid
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-5
      gap-4 sm:gap-6
    "
    >
      <StatCard label="Total Issues" value={stats.total} />
      <StatCard label="Pending" value={stats.pending} />
      <StatCard label="In Progress" value={stats.inProgress} />
      <StatCard label="Verification" value={stats.verification} />
      <StatCard label="Completed" value={stats.completed} />
    </div>



    {/* ================= PRIORITY ISSUES ================= */}

    <div className="bg-[#1e293b] rounded-2xl p-4 sm:p-6">

      <div className="flex justify-between items-center mb-4 sm:mb-5">

        <h3 className="text-lg sm:text-xl font-semibold">
          Priority Issues
        </h3>

        <button
          onClick={() => navigate("/dept/issues")}
          className="text-indigo-400 hover:underline text-sm sm:text-base"
        >
          View All →
        </button>

      </div>


      {issues.length === 0 ? (

        <p className="text-slate-400 text-sm">
          No issues assigned yet.
        </p>

      ) : (

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4 sm:gap-6
          "
        >

          {issues.map((issue) => (

            <div
              key={issue._id}
              onClick={() => navigate(`/dept/issues/${issue._id}`)}
              className="
              bg-[#0f172a]
              rounded-xl
              overflow-hidden
              cursor-pointer
              hover:scale-[1.02]
              transition
              shadow-lg
              "
            >

              {/* IMAGE */}
              <img
                src={issue.imageUrl}
                alt="issue"
                className="h-36 sm:h-40 w-full object-cover"
              />


              {/* CONTENT */}
              <div className="p-3 sm:p-4 space-y-2">

                <h4 className="font-semibold text-sm sm:text-base">
                  {issue.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  {issue.location?.address}
                </p>


                {/* PRIORITY + SLA */}
                <div className="flex justify-between items-center">

                  <span
                    className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold
                    ${
                      issue.priority === "Critical"
                        ? "bg-red-500/20 text-red-400"
                        : issue.priority === "High"
                        ? "bg-orange-500/20 text-orange-400"
                        : issue.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {issue.priority}
                  </span>

                  <span className="text-[10px] sm:text-xs text-indigo-400">
                    {getSLA(issue.slaDeadline)}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
);
function StatCard({ label, value }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">

      <div className="bg-indigo-500/20 p-2 sm:p-3 rounded-xl">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-400 rounded-md" />
      </div>

      <div>
        <p className="text-xs sm:text-sm text-slate-400">
          {label}
        </p>

        <p className="text-lg sm:text-2xl font-bold">
          {value}
        </p>
      </div>

    </div>
  );
}
}

export default DeptDashboard;
