import { Bell, User, Home, Inbox, LogOut } from "lucide-react";

function AppShell({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col justify-between shadow-xl">
        
        <div>
          {/* Logo */}
          <div className="text-2xl font-bold px-6 py-6 border-b border-indigo-600">
            CivicAI 🚀
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-2 px-3">
            
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200">
              <Home size={20} />
              Dashboard
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200">
              <Inbox size={20} />
              Inbox
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200">
              <User size={20} />
              Account
            </div>

          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-600">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 cursor-pointer transition">
            <LogOut size={20} />
            Logout
          </div>
        </div>

      </aside>


      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="h-16 bg-white flex items-center justify-between px-8 shadow-sm">
          
          <h1 className="text-lg font-semibold text-gray-700">
            Welcome 👋
          </h1>

          <div className="flex items-center gap-6">
            <Bell className="cursor-pointer hover:scale-110 transition" />
            <User className="cursor-pointer hover:scale-110 transition" />
          </div>

        </header>


        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppShell;
