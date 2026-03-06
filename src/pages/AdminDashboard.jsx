import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMap from "../pages/AdminMap";

function AdminDashboard() {

  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchIssues = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/issues",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIssues(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchIssues();

  }, []);

  //////////////////////////////////////////////////////
  // STATS
  //////////////////////////////////////////////////////

  const total = issues.length;
  const pending = issues.filter(i => i.status === "Pending").length;
  const approved = issues.filter(i => i.status === "Approved").length;
  const completed = issues.filter(i => i.status === "Completed").length;

  //////////////////////////////////////////////////////
  // FILTERED DATA
  //////////////////////////////////////////////////////

  const pendingIssues = issues.filter(i => i.status === "Pending");
  const verificationQueue = issues.filter(
    i => i.status === "Pending Verification"
  );

  //////////////////////////////////////////////////////
  // DEPT ANALYTICS
  //////////////////////////////////////////////////////

  const deptStats = {};

  issues.forEach(issue => {

    const dept = issue.department || "Unassigned";

    if (!deptStats[dept]) {
      deptStats[dept] = {
        total: 0,
        completed: 0
      };
    }

    deptStats[dept].total++;

    if(issue.status === "Completed")
      deptStats[dept].completed++;
  });

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

  <div className="space-y-8 px-3 sm:px-6 md:px-10">

    {/* HERO */}
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Admin Command Center 🧠
      </h1>

      <p className="text-slate-400 mt-2 text-sm sm:text-base">
        Monitor, manage and resolve civic problems efficiently.
      </p>
    </div>



    {/* STATUS BAR */}
    <div className="
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      rounded-2xl sm:rounded-3xl
      p-4 sm:p-6
      grid
      grid-cols-2
      sm:grid-cols-2
      md:grid-cols-4
      gap-4 sm:gap-6
    ">

      <Stat icon={<ClipboardList className="text-indigo-400"/>} label="Total Issues" value={total}/>
      <Stat icon={<Clock className="text-yellow-400"/>} label="Pending" value={pending}/>
      <Stat icon={<AlertTriangle className="text-blue-400"/>} label="Approved" value={approved}/>
      <Stat icon={<CheckCircle className="text-green-400"/>} label="Completed" value={completed}/>

    </div>



    {/* REPORTED ISSUES */}
    <SectionCard
      title="Reported Issues"
      subtitle="Requires admin action"
      button="Open Control Center →"
      onClick={() => navigate("/admin/issues")}
    >

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2">

        {pendingIssues.slice(0,6).map(issue => (

          <PreviewCard
            key={issue._id}
            issue={issue}
            onClick={() => navigate("/admin/issues")}
          />

        ))}

      </div>

    </SectionCard>



    {/* GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">


      {/* VERIFICATION */}
      <SectionCard
        title="Awaiting Verification"
        subtitle="Completed by departments"
        button="Open →"
        onClick={() => navigate("/admin/verification")}
      >

        {verificationQueue.length === 0 ? (

          <p className="text-slate-400 text-sm">
            No issues awaiting approval 🎉
          </p>

        ) : (

          <div className="space-y-3 sm:space-y-4">

            {verificationQueue.slice(0,4).map(issue => (

              <MiniCard
                key={issue._id}
                issue={issue}
                onClick={() => navigate("/admin/verification")}
              />

            ))}

          </div>

        )}

      </SectionCard>




      {/* DEPARTMENT PERFORMANCE */}
      <SectionCard
        title="Department Performance"
        subtitle="Resolution efficiency"
      >

        <div className="space-y-3 sm:space-y-4">

          {Object.entries(deptStats)
            .sort((a,b)=> b[1].total - a[1].total)
            .map(([dept, data]) => (

            <div
              key={dept}
              className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4"
            >

              <div className="flex justify-between mb-2">

                <h3 className="font-semibold text-sm sm:text-base">
                  {dept}
                </h3>

                <span className="text-xs sm:text-sm text-slate-400">
                  {data.total} issues
                </span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-2">

                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{
                    width: `${(data.completed / data.total) * 100 || 0}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </SectionCard>

    </div>



    {/* MAP */}
    <AdminMap issues={issues} />

  </div>

);
}

//////////////////////////////////////////////////////
// SMALL COMPONENTS (clean architecture)
//////////////////////////////////////////////////////

const Stat = ({icon, label, value}) => (

  <div className="flex items-center gap-3 sm:gap-4">

    <div className="p-2 bg-white/5 rounded-xl">
      {icon}
    </div>

    <div>
      <p className="text-lg sm:text-2xl font-bold">{value}</p>
      <p className="text-xs sm:text-sm text-slate-400">{label}</p>
    </div>

  </div>

);
const SectionCard = ({title, subtitle, button, onClick, children}) => (

  <div className="
    bg-white/5
    backdrop-blur-xl
    border border-white/10
    rounded-2xl sm:rounded-3xl
    p-4 sm:p-8
  ">

    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">

      <div>
        <h2 className="text-lg sm:text-2xl font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-slate-400 text-xs sm:text-sm">{subtitle}</p>
        )}
      </div>

      {button && (
        <button
          onClick={onClick}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-sm"
        >
          {button}
        </button>
      )}

    </div>

    {children}

  </div>

);
const PreviewCard = ({issue, onClick}) => (

  <div
    onClick={onClick}
    className="
      min-w-[220px]
      sm:min-w-[260px]
      bg-white/5
      hover:bg-white/10
      border border-white/10
      rounded-2xl
      cursor-pointer
      transition
    "
  >

    <img
      src={issue.imageUrl}
      className="h-32 sm:h-36 w-full object-cover rounded-t-2xl"
    />

    <div className="p-3 sm:p-4">

      <h3 className="font-semibold text-sm sm:text-base">
        {issue.title}
      </h3>

      <p className="text-xs text-slate-400 line-clamp-2">
        {issue.description}
      </p>

    </div>

  </div>

);
const MiniCard = ({issue, onClick}) => (

  <div
    onClick={onClick}
    className="
      flex gap-3 sm:gap-4
      bg-white/5
      hover:bg-white/10
      p-3
      rounded-xl
      cursor-pointer
      transition
    "
  >

    <img
      src={issue.departmentProofImage || issue.imageUrl}
      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
    />

    <div>
      <p className="font-semibold text-sm sm:text-base">
        {issue.title}
      </p>

      <p className="text-xs text-green-400">
        Ready for approval
      </p>
    </div>

  </div>

);
export default AdminDashboard;
