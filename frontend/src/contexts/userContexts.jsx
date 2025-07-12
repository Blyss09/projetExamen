// contexts/userContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      console.log("Fetching user...");
      
      const tokenRes = await axios.get(
        "http://localhost:5000/jwtid",
        { withCredentials: true }
      );
      console.log("Token response:", tokenRes.data);
      
      const userRes = await axios.get(
        `http://localhost:5000/api/user/${tokenRes.data}`,
        { withCredentials: true }
      );
      console.log("User response:", userRes.data);
      
      if (userRes.data.success) {
        setUser(userRes.data.data);
        console.log("User set in context:", userRes.data.data);
      } else {
        setUser(null);
        console.log("No user data received");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('username');
  };

  useEffect(() => {
    console.log("UserProvider useEffect - initial fetch");
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
