import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Search } from "lucide-react";

function AdminVerification() {

  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  //////////////////////////////////////////////////////
  // FETCH
  //////////////////////////////////////////////////////

  const fetchIssues = async () => {

    const res = await axios.get(
      "https://civic-issue-reporter-c7du.onrender.com/api/issues/verification",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  //////////////////////////////////////////////////////
  // VERIFY
  //////////////////////////////////////////////////////

  const approveIssue = async (id) => {

    await axios.put(
      `https://civic-issue-reporter-c7du.onrender.com/api/issues/${id}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchIssues();
  };

  //////////////////////////////////////////////////////
  // FILTER
  //////////////////////////////////////////////////////

  const filtered = issues.filter(issue =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  );

return (
  <div className="text-white px-3 sm:px-6 md:px-10">

    {/* ================= HEADER ================= */}
    <div className="
      flex flex-col sm:flex-row
      sm:items-center
      sm:justify-between
      gap-4
      mb-8
    ">

      <h1 className="text-2xl sm:text-3xl font-bold">
        Completion Verification ✅
      </h1>

      {/* SEARCH */}
      <div className="relative w-full sm:w-72">

        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          placeholder="Search completed issues..."
          className="
            w-full
            bg-white/10
            pl-9 pr-4 py-2
            rounded-xl
            border border-white/10
            outline-none
            text-sm
          "
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

    </div>



    {/* ================= ISSUE CARDS ================= */}

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      gap-6
    ">

      {filtered.map(issue => (

        <div
          key={issue._id}
          className="
          bg-white/5
          border border-white/10
          rounded-2xl
          p-4 sm:p-5
          space-y-4
        ">

          {/* TITLE */}
          <h2 className="text-lg sm:text-xl font-semibold">
            {issue.title}
          </h2>



          {/* BEFORE / AFTER */}
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
          ">

            {/* BEFORE */}
            <div>
              <p className="text-xs sm:text-sm text-slate-400 mb-1">
                BEFORE
              </p>

              <img
                src={issue.imageUrl}
                className="
                rounded-xl
                h-44 sm:h-40
                w-full
                object-cover
              "
              />
            </div>

            {/* AFTER */}
            <div>
              <p className="text-xs sm:text-sm text-slate-400 mb-1">
                AFTER
              </p>

              <img
                src={issue.departmentProofImage}
                className="
                rounded-xl
                h-44 sm:h-40
                w-full
                object-cover
              "
              />
            </div>

          </div>



          {/* LOCATION */}
          <p className="text-xs sm:text-sm text-slate-400">
            📍 {issue.location?.address}
          </p>


          {/* DEPARTMENT */}
          <p className="text-xs sm:text-sm text-indigo-300">
            Dept: {issue.department}
          </p>



          {/* ACTIONS */}
          <div className="
            flex flex-col sm:flex-row
            gap-3
            mt-4
          ">

            <button
              onClick={()=>approveIssue(issue._id)}
              className="
                flex-1
                bg-green-600 hover:bg-green-700
                py-2
                rounded-xl
                flex items-center justify-center gap-2
                text-sm
              "
            >
              <CheckCircle size={16}/>
              Approve
            </button>

            <button
              className="
                flex-1
                bg-red-600 hover:bg-red-700
                py-2
                rounded-xl
                flex items-center justify-center gap-2
                text-sm
              "
            >
              <XCircle size={16}/>
              Reject
            </button>

          </div>

        </div>

      ))}

    </div>

  </div>
);
}

export default AdminVerification;
