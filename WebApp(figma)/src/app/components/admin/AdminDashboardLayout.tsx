import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Receipt,
  DollarSign,
  BarChart3,
  Menu as MenuIcon,
  FileText,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

export function AdminDashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { to: "/restaurant-admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/restaurant-admin/comps", icon: Receipt, label: "Comps" },
    { to: "/restaurant-admin/spend", icon: DollarSign, label: "Spend" },
    { to: "/restaurant-admin/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/restaurant-admin/menu", icon: MenuIcon, label: "Edit Menu" },
    { to: "/restaurant-admin/deliverables", icon: FileText, label: "Edit Deliverables" },
    { to: "/restaurant-admin/profile", icon: User, label: "Edit Profile" },
    { to: "/restaurant-admin/support", icon: HelpCircle, label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white/5 backdrop-blur-sm border-r border-white/5 flex flex-col transition-all duration-300 fixed h-screen z-50`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="font-bold">CC</span>
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-semibold">Restaurant Name</div>
              <div className="text-xs text-white/50">Admin Dashboard</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-blue-600 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white/10 backdrop-blur-sm border border-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${
              sidebarOpen ? "" : "rotate-180"
            }`}
          />
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 p-8`}
      >
        <Outlet />
      </main>
    </div>
  );
}