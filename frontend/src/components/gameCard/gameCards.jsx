import { Link } from 'react-router-dom';
import './gameCards.css';

const GameCards = () => {
  return (
    <div className="game_card">
      <div className="container">
        <div className="card">
          <div className="face face1">
            <div className="content">
              <img src="./src/assets/img/morpion.png" alt="Morpion" />
              <h3>Morpion</h3>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <p className="text_game">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
              <Link to="/games/morpion">Jouer !</Link>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="face face1">
            <div className="content">
              <img src="./src/assets/img/pendu.png" alt="Pendu" />
              <h3>Pendu</h3>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <p className="text_game">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
              <Link to="/games/pendu">Jouer !</Link>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="face face1">
            <div className="content">
              <img src="./src/assets/img/pierreFeuilleCiseaux.jpg" alt="Shi-Fu-Mi" />
              <h3>Shi-Fu-Mi</h3>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <p className="text_game">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
              <Link to="/games/shifumi">Jouer !</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="card">
          <div className="face face1">
            <div className="content">
              <img src="./src/assets/img/morpion.png" alt="Morpion" />
              <h3>Morpion</h3>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <p className="text_game">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
              <Link to="/games/morpion">Jouer !</Link>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="face face1">
            <div className="content">
              <img src="./src/assets/img/pendu.png" alt="Pendu" />
              <h3>Pendu</h3>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <p className="text_game">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
              <Link to="/games/pendu">Jouer !</Link>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="face face1">
            <div className="content">
              <img src="./src/assets/img/pierreFeuilleCiseaux.jpg" alt="Shi-Fu-Mi" />
              <h3>Shi-Fu-Mi</h3>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <p className="text_game">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
              <Link to="/games/shifumi">Jouer !</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCards;
