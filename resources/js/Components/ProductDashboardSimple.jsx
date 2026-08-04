import React, { useState,useMemo } from "react";
import { Plus, Pencil, Trash2, X, Package, Search } from "lucide-react";

// ---------------------------------------------------------------------------
// Data awal (contoh). Ganti dengan data dari API Laravel kamu, misal:
// useEffect(() => { fetch('/api/products').then(r => r.json()).then(setProducts) }, [])
// ---------------------------------------------------------------------------
const initialProducts = [
  { id: 1, name: "sepatu", price: 450000, stock: 42 },
  { id: 2, name: "Kemeja Flanel Katun", price: 185000, stock: 67 },
  { id: 3, name: "celana jeans", price: 180000, stock: 56 },
];

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const emptyForm = { name: "", price: "", stock: "" };

export default function ProductDashboardSimple() {
  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
 
  const filteredproducts = useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.name.toLowerCase().includes(q));
}, [products, query]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), stock: String(p.stock) });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = { name: form.name.trim(), price: Number(form.price) || 0, stock: Number(form.stock) || 0 };

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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-semibold text-slate-800">Daftar Produk</h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {/*search bar*/}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
          <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="cari produk.."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredproducts.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-700">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{formatRupiah(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.stock === 0
                          ? "bg-rose-50 text-rose-600"
                          : p.stock <= 10
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {p.stock}
                    </span>
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
              {filteredproducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    {products.length === 0 
                    ? "belum ada produk."
                  :`tidak ada produk yang cocok dengan "${query}"`}
                    
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tambah/edit */}
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
