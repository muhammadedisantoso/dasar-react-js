import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

const STORAGE_KEY = "produk-toko";

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  // Baca ulang data setiap kali halaman Dashboard dibuka
  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const totalProduk = products.length;
  const totalNilai = products.reduce((sum, p) => sum + p.price * p.stock, 0);

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
            <p className="text-lg font-semibold text-slate-800">{totalProduk}</p>
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
            <p className="text-xs text-slate-400">Nilai Inventori</p>
            <p className="text-lg font-semibold text-slate-800">{formatRupiah(totalNilai)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}