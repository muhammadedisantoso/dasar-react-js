import { useState, useEffect, useCallback } from "react";
import { fetchProducts, saveProducts } from "../api/products";


export function useProducts() {
  const [products, setProductsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data pertama kali (simulasi "GET /api/products")
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setProductsState(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("Gagal memuat produk.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update produk (tambah/edit/hapus) sekaligus otomatis tersimpan
  const mutateProducts = useCallback((updater) => {
    setProductsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveProducts(next); // "PUT/POST" ke API, di sini masih localStorage
      return next;
    });
  }, []);

  return { products, loading, error, setProducts: mutateProducts };
}
