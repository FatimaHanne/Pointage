import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les infos du localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const expiration = localStorage.getItem("expiration");

    if (storedUser && expiration) {
      const now = new Date().getTime();
      if (now < parseInt(expiration)) {
        setUser(storedUser);
      } else {
        logout(); // session expirée
      }
    }
  }, []);

  const login = (userData) => {
    const now = new Date().getTime();
    const expireIn24h = now + 24 * 60 * 60 * 1000; // 24 heures en ms

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("expiration", expireIn24h.toString());
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("expiration");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
