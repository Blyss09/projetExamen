// contexts/userContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const tokenRes = await axios.get(
        `${import.meta.env.VITE_API_URL}jwtid`,
        { withCredentials: true }
      );
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}api/user/${tokenRes.data}`,
        { withCredentials: true }
      );
      setUser(userRes.data);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
