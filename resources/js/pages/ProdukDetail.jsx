import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "produk-toko";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function ProdukDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const products = saved ? JSON.parse(saved) : [];
      const found = products.find((p) => String(p.id) === id);
      setProduct(found || null);
    } catch {
      setProduct(null);
    }
  }, [id]);

  if (product === undefined) {
    return <div className="p-6 text-sm text-slate-500">Memuat...</div>;
  }

  if (product === null) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-3">Produk dengan ID "{id}" tidak ditemukan.</p>
        <Link to="/dashboard/produk" className="text-indigo-600 text-sm font-medium">
          Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md">
      <button
        onClick={() => navigate("/dashboard/produk")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h1 className="text-lg font-semibold text-slate-800 mb-3">{product.name}</h1>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">ID Produk</dt>
            <dd className="text-slate-700">{product.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Harga</dt>
            <dd className="text-slate-700">{formatRupiah(product.price)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Stok</dt>
            <dd className="text-slate-700">{product.stock}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}