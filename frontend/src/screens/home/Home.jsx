import "./home.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <main>
      <div className="home">
        <div className="blur-overlay"></div>
        <div className="content">
          <h1>Bienvenu sur CoolGames</h1>
          <span>Le site de mini-jeux seul ou à plusieurs</span>
          <div className="enter-buttons">
            <button id="button-log" onClick={() => navigate("/login")}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text"> Connexion </span>
            </button>
            <button id="button-reg" onClick={() => navigate("/register")}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text">S'inscrire</span>
            </button>
          </div>
          <button id="button-main" onClick={() => navigate("/games")}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text"> Continuer en tant qu'invite </span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
