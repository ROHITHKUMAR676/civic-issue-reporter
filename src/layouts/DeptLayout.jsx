import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiBell } from "react-icons/hi";
import { LogOut } from "lucide-react";

function DeptLayout() {

  const navigate = useNavigate();
  const department = localStorage.getItem("department") || "Department";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1a33] to-[#020617] text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
      <header className="
        border-b border-slate-800
        flex flex-col md:flex-row
        md:items-center
        justify-between
        gap-4
        px-4 sm:px-6 md:px-10
        py-4
      ">

        {/* LEFT SECTION */}
        <div className="flex items-center justify-between md:justify-start gap-6">

          {/* LOGO */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            Civic<span className="text-indigo-400">Dept</span>
          </h1>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8">

            <NavLink
              to="/dept/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 font-semibold"
                  : "text-slate-300 hover:text-white transition"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/dept/issues"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 font-semibold"
                  : "text-slate-300 hover:text-white transition"
              }
            >
              Issues
            </NavLink>

          </nav>

        </div>


        {/* RIGHT SECTION */}
        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6">

          {/* MOBILE NAV */}
          <div className="flex md:hidden gap-4 text-sm">

            <NavLink
              to="/dept/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 font-semibold"
                  : "text-slate-300"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/dept/issues"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 font-semibold"
                  : "text-slate-300"
              }
            >
              Issues
            </NavLink>

          </div>


          {/* Department Badge */}
          <div className="bg-indigo-600 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
            {department}
          </div>


          {/* Inbox */}
          <button
            onClick={() => navigate("/inbox")}
            className="relative hover:text-indigo-400 transition"
          >
            <HiBell size={22}/>
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"/>
          </button>


          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2
              bg-indigo-600 hover:bg-indigo-700
              px-3 sm:px-5 py-2
              rounded-xl
              transition
              shadow-lg
              text-sm
            "
          >
            <LogOut size={16}/>
            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>

      </header>



      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <Outlet />
      </main>

    </div>

  );
}

export default DeptLayout;