import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContexts";
import axios from "axios";
import "./logIn.css";

const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Réponse backend :", res.data);

      if (res.data.errors) {
        setErrorMessage(res.data.errors);
      } else if (res.data.success) {
        console.log("Connexion réussie, redirection...");
        
        // Mettre à jour l'état utilisateur
        await fetchUser();
        
        // Stocker le nom d'utilisateur pour le chat
        if (res.data.user) {
          localStorage.setItem('username', res.data.user.pseudo || res.data.user.email);
        }
        
        // Petit délai pour s'assurer que l'état est mis à jour
        setTimeout(() => {
          navigate("/games");
        }, 100);
      } else {
        setErrorMessage("Identifiants incorrects.");
      }
    } catch (err) {
      console.error("Erreur attrapée :", err);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="login">
      <div className="blur-overlay">
        <div className="content">
          <div className="login-box">
            <p>Connexion</p>
            <form onSubmit={handleLogin}>
              <div className="user-box">
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
              </div>
              <div className="user-box">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Mot de passe</label>
              </div>
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}
              <div className="buttons-menu">
                <button type="submit" className="styled-button">Entrer</button>
                <button type="button" className="styled-button" onClick={() => navigate("/")}>Quitter</button>
              </div>
            </form>
            <p>
              Toujours pas de compte ?{" "}
              <a onClick={() => navigate("/register")} className="a2">
                S'inscrire !
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
