import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  X,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function stockStatus(stock) {
  if (stock === 0) return "habis";
  if (stock <= 10) return "menipis";
  return "aman";
}

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nama (A-Z)" },
  { value: "name-desc", label: "Nama (Z-A)" },
  { value: "price-asc", label: "Harga (Rendah-Tinggi)" },
  { value: "price-desc", label: "Harga (Tinggi-Rendah)" },
  { value: "stock-asc", label: "Stok (Sedikit-Banyak)" },
  { value: "stock-desc", label: "Stok (Banyak-Sedikit)" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "aman", label: "Stok Aman" },
  { value: "menipis", label: "Stok Menipis" },
  { value: "habis", label: "Stok Habis" },
];

const PAGE_SIZE = 5;
const DEFAULT_SORT = "name-asc";
const DEFAULT_STATUS = "all";

export default function Produk() {
  const { products, loading, setProducts } = useProducts();

  // --- Search (dengan debounce untuk optimasi performa) ---
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  // --- Filter & sort ---
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  // --- Pagination ---
  const [page, setPage] = useState(1);

  // --- Modal tambah/edit ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const isFilterActive = debouncedQuery.trim() !== "" || statusFilter !== DEFAULT_STATUS || sortBy !== DEFAULT_SORT;

  function resetFilters() {
    setQuery("");
    setStatusFilter(DEFAULT_STATUS);
    setSortBy(DEFAULT_SORT);
    setPage(1);
  }

  // Filtering + sorting dihitung ulang HANYA saat dependensinya berubah
  // (bukan di setiap render), ini bagian optimasi performa lainnya.
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1) Searching (pakai nilai yang sudah di-debounce, bukan query langsung)
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // 2) Filtering berdasarkan status stok
    if (statusFilter !== "all") {
      result = result.filter((p) => stockStatus(p.stock) === statusFilter);
    }

    // 3) Sorting
    const [field, direction] = sortBy.split("-");
    result.sort((a, b) => {
      let cmp = 0;
      if (field === "name") cmp = a.name.localeCompare(b.name);
      else cmp = a[field] - b[field];
      return direction === "desc" ? -cmp : cmp;
    });

    return result;
  }, [products, debouncedQuery, statusFilter, sortBy]);

  // Pagination dihitung dari hasil yang sudah difilter+sort
  const totalPages = Math.max(1, Math.ceil(processedProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processedProducts.slice(start, start + PAGE_SIZE);
  }, [processedProducts, currentPage]);

  function goToPage(p) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  // Reset ke halaman 1 setiap kali pencarian/filter/sort berubah
  function handleQueryChange(value) {
    setQuery(value);
    setPage(1);
  }
  function handleStatusChange(value) {
    setStatusFilter(value);
    setPage(1);
  }
  function handleSortChange(value) {
    setSortBy(value);
    setPage(1);
  }

  function openAdd() {
    setEditingId(null);
    setForm({ name: "", price: "", stock: "" });
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800">Produk</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {/* Toolbar: search + filter + sort + reset */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isFilterActive && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filter
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Harga</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium text-right">Detail</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Memuat produk...
                </td>
              </tr>
            )}

            {!loading &&
              paginatedProducts.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
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
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/dashboard/produk/${p.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
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

            {!loading && paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  {isFilterActive
                    ? "Tidak ada produk yang cocok dengan pencarian/filter ini."
                    : "Belum ada produk."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && processedProducts.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Menampilkan {paginatedProducts.length} dari {processedProducts.length} produk
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
