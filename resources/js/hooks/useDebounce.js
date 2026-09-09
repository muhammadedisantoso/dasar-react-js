import { useState, useEffect } from "react";


export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Kalau value berubah lagi sebelum timer selesai, timer lama dibatalkan.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
