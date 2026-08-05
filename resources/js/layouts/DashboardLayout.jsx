import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Boxes } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/produk", label: "Produk", icon: Package },
  { to: "/dashboard/pesanan", label: "Pesanan", icon: ShoppingCart },
];

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 shrink-0 bg-indigo-950 text-indigo-100 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-indigo-900">
          <Boxes className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-white">TokoKu</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-amber-400 text-indigo-950" : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-900">
          <p className="text-xs text-indigo-300 mb-2">Masuk sebagai {user?.username}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-200 hover:bg-indigo-900 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}