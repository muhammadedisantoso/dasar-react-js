

const STORAGE_KEY = "produk-toko";
const SIMULATED_DELAY = 300; // ms, biar loading state kelihatan/terasa nyata

const defaultProducts = [
  { id: 1, name: "sepatu", price: 450000, stock: 42 },
  { id: 2, name: "Kemeja Flanel Katun", price: 185000, stock: 8 },
  { id: 3, name: "celana jeans", price: 180000, stock: 0 },
];

function readFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

function writeToStorage(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/** Mengambil semua produk. Mengembalikan Promise, seperti fetch() beneran. */
export function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readFromStorage()), SIMULATED_DELAY);
  });
}

/** Menyimpan seluruh array produk. Mengembalikan Promise. */
export function saveProducts(products) {
  return new Promise((resolve) => {
    writeToStorage(products);
    setTimeout(() => resolve(products), SIMULATED_DELAY);
  });
}
