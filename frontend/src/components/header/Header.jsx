import { Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect } from 'react';
import { useUser } from "../../contexts/userContexts.jsx";
import "./header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    navigate("/login")
  }

  useEffect(() => {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.navigation');
    const main = document.querySelector('main');
    const body = document.querySelector('body');

    const toggleMenu = () => {
      nav.classList.toggle('active');
      main.classList.toggle('menu-active');
      body.classList.toggle('overflowHidden');
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log('click');
    };

    burgerMenu.addEventListener('click', toggleMenu);
  }, []);

  return (
    <header>
      <div className="nav">
        <div className="logo">
          <img src="./src/assets/img/logo.jpg" alt="logo site" />
        </div>
        <div className="navigationHeader">
          <ul id="navigation-content">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">Accueil</Link>
            </li>
            <li className={location.pathname === "/games" ? "active" : ""}>
              <Link to="/games">Jeux</Link>
            </li>
            <li className={location.pathname === "/ladder" ? "active" : ""}>
              <Link to="/ladder">Classement</Link>
            </li>
            <li
              id="profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              <Link to="/profile">{user ? user.pseudo : "Profile"}</Link>
            </li>
            {user && (
              <li>
                <button onClick={handleLogout} className="logout-button" aria-label="Déconnexion">
                  <i className="bx bx-power-off"></i>
                </button>
              </li>
            )}
          </ul>
        </div>
        <button className="burger-menu" aria-label="Ouvrir le menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className="navigation">
          <ul id="navigationBurger-content">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">Accueil</Link>
            </li>
            <li className={location.pathname === "/games" ? "active" : ""}>
              <Link to="/games">Jeux</Link>
            </li>
            <li className={location.pathname === "/ladder" ? "active" : ""}>
              <Link to="/ladder">Classement</Link>
            </li>
            <li
              id="profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              <Link to="/profile">{user ? user.pseudo : "Profile"}</Link>
            </li>
            {user && (
              <li>
                <button onClick={handleLogout} className="logout-button" aria-label="Déconnexion">
                  <i className="bx bx-power-off"></i>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
