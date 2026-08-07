import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronRight, Pencil, Trash2, X } from "lucide-react";

const STORAGE_KEY = "produk-toko";

const defaultProducts = [
  { id: 1, name: "sepatu", price: 450000, stock: 42 },
  { id: 2, name: "Kemeja Flanel Katun", price: 185000, stock: 67 },
  { id: 3, name: "celana jeans", price: 180000, stock: 56 },
];

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function Produk() {
  const [products, setProducts] = useState(loadProducts);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({name:"",price:"",stock:""});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  function openAdd () {
    setEditingId(null);
    setForm ({name:"", price:"", stock:""});
    setModalOpen(true);
  }

function openEdit(p){
  setEditingId(p.id);
  setForm ({ name: p.name, price: String(p.price), stock:String(p.stock)});
  setModalOpen(true);
}

function handleSubmit(e) {
  e.preventDefault();
  if (!form.name.trim()) return;
  const payload = { name: form.name.trim(), price: Number(form.price) || 0, stock: Number(form.stock) || 0 
  };

 
   if (editingId) {
    setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
  } else {
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts((prev) => [{ id: newId, ...payload }, ...prev]);
  }
  setModalOpen(false);
}

function handleDelete(id) {
  if (confirm("Hapus produk ini?")) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }
}


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800">Produk</h1>
        <button 
        onClick={openAdd}
        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg">
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari produk..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Harga</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium text-right">Detail</th>
              <th className="px-4 py-3 font-medium text-right">aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-700">{p.name}</td>
                <td className="px-4 py-3 text-slate-600">{formatRupiah(p.price)}</td>
                <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                <td className="px-4 py-3 text-right">
  <Link to={`/dashboard/produk/${p.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium">
    Lihat
    <ChevronRight className="w-3.5 h-3.5" />
  </Link>
</td>
<td className="px-4 py-3">
  <div className="flex items-center justify-end gap-1">
    <button
      onClick={() => openEdit(p)}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
      aria-label="Edit"
    >
      <Pencil className="w-4 h-4" />
    </button>
    <button
      onClick={() => handleDelete(p.id)}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600"
      aria-label="Hapus"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
    <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
        <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Nama Produk</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Contoh: Wireless Earbuds Pro"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Harga</label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Stok</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}