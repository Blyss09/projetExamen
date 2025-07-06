import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        {
          pseudo,
          email,
          password,
          confirmPassword,
        }
      );
      if (!response.data.success) {
        setErrorMessage(response.data.message);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue pendant la création du compte",
        error
      );
      if (error.response?.data?.errors) {
        const { pseudo, email, password } = error.response.data.errors;
        setErrorMessage(pseudo || email || password || "Erreur inconnue");
      } else {
        setErrorMessage("Erreur serveur. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="register">
      <div className="blur-overlay">
        <div className="content">
          <div className="login-box">
            <p>S'enregistrer</p>
            <form id="register-form" onSubmit={handleSubmit}>
              <div className="user-box">
                <input
                  id="signup-pseudo"
                  required="required"
                  name="pseudo"
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                />
                <label>Pseudo</label>
              </div>
              <div className="user-box">
                <input
                  id="signup-email"
                  required="required"
                  name="email"
                  type="email"
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
              </div>
              <div className="user-box">
                <input
                  id="signup-password"
                  required="required"
                  name="password"
                  type="password"
                  pattern=".{8,}"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Mot de passe</label>
              </div>
              <div className="user-box">
                <input
                  id="signup-confirm-password"
                  required="required"
                  name="confirmPassword"
                  type="password"
                  pattern=".{8,}"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label>Confirmation Mot De Passe</label>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="buttons-menu">
                <button type="submit" className="styled-button">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  S'inscrire
                </button>
                <button
                  type="button"
                  className="styled-button"
                  onClick={() => navigate("/")}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Quitter
                </button>
              </div>
            </form>
            <p>
              Déjà inscrit ?{" "}
              <a onClick={() => navigate("/login")} className="a2">
                Connecte toi !
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
