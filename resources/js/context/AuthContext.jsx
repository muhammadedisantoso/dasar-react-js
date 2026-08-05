import react, {createContext,useContext,useState} from "react";

const AuthContext = createContext(null);

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const STORAGE_KEY = "auth-user";

export function AuthProvider({ children}) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const userData = { username };                      // dideklarasikan di sini
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData)); // dipakai di sini
    setUser(userData);                                    // dan di sini
    return true;
  }
  return false;
}
    function logout(){
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{user , isAuthenticated: !!user , login , logout}}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}