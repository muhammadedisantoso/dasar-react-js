import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth-user";

// kredensial dummy, HANYA untuk latihan frontend
const DUMMY_USERNAME = "admin";
const DUMMY_PASSWORD = "admin";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    async function login(username, password) {
        setIsLoading(true);
        try {
            // simulasi delay network, biar loading state kelihatan efeknya
            await new Promise((resolve) => setTimeout(resolve, 600));

            if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
                const userData = { username };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                setUser(userData);
            } else {
                throw new Error("Username atau password salah");
            }
        } finally {
            setIsLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
    return ctx;
}