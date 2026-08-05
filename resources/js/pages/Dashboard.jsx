import React from "react";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-6">Ringkasan toko kamu hari ini.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Produk</p>
            <p className="text-lg font-semibold text-slate-800">3</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Pesanan Baru</p>
            <p className="text-lg font-semibold text-slate-800">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Pendapatan</p>
            <p className="text-lg font-semibold text-slate-800">Rp 0</p>
          </div>
        </div>
      </div>
    </div>
  );
}