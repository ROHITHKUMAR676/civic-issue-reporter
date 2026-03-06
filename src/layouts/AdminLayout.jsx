import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import { HiBell } from "react-icons/hi";

function AdminLayout() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">

      {/* 🔥 TOP NAVBAR */}
      <header
        className="
        flex items-center justify-between
        px-4 sm:px-6 md:px-10
        py-4 sm:py-5
        border-b border-white/10
        backdrop-blur-xl bg-white/5
        sticky top-0 z-50
      "
      >

        {/* LOGO */}
        <div className="flex items-center gap-2 sm:gap-3">

          <Shield
            className="text-indigo-400"
            size={24}
          />

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
            CivicAI Admin
          </h1>

        </div>



        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* 🔔 Inbox */}
          <button
            onClick={() => navigate("/inbox")}
            className="relative hover:text-indigo-400 transition"
          >
            <HiBell size={22} />

            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />
          </button>



          {/* Logout */}
          <button
            onClick={logout}
            className="
              flex items-center gap-2
              bg-indigo-600 hover:bg-indigo-700
              px-3 sm:px-5 py-2
              rounded-xl
              transition
              shadow-lg
              text-sm sm:text-base
            "
          >

            <LogOut size={16} />

            {/* Hide text on mobile */}
            <span className="hidden sm:inline">
              Logout
            </span>

          </button>

        </div>

      </header>



      {/* 🔥 PAGE CONTENT */}
      <main className="p-4 sm:p-6 md:p-10">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;