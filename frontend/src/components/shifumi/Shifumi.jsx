import React, { useState, useEffect } from "react";
import "./shifumi.css";
import { getShifumiSocket } from "../../services/socketShifumi";
import { useUser } from "../../contexts/userContexts";

const CHOICES = [
  { value: "pierre", emoji: "✊" },
  { value: "feuille", emoji: "✋" },
  { value: "ciseaux", emoji: "✌️" },
];

const Shifumi = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState({
    players: [],
    gameData: { rounds: [], choices: {} },
    isFinished: false,
    winner: null
  });
  const [roomId, setRoomId] = useState("");
  const [isInGame, setIsInGame] = useState(false);
  const [selectedMove, setSelectedMove] = useState("");
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  // Initialisation socket.io
  useEffect(() => {
    const s = getShifumiSocket();
    setSocket(s);
    setIsConnected(true);
    return () => {
      s.disconnect();
    };
  }, []);

  // Gestion des événements Socket.IO
  useEffect(() => {
    if (!socket) return;
    socket.on('shifumi:welcome', () => {
    });
    socket.on('shifumi:update', (data) => {
      setGameState(data);
      setWaitingForOpponent(false);
      if (Object.keys(data.gameData.choices).length === 0) {
        setSelectedMove('');
      }
    });
    return () => {
      socket.off('shifumi:welcome');
      socket.off('shifumi:update');
    };
  }, [socket]);

  // Rejoindre une partie
  const joinGame = () => {
    if (!socket || !roomId || !user || !user._id) return;
    socket.emit('shifumi:join', { roomId, userId: user._id });
    setIsInGame(true);
  };

  // Nouvelle partie
  const newGame = () => {
    setGameState({
      players: [],
      gameData: { rounds: [], choices: {} },
      isFinished: false,
      winner: null
    });
    setIsInGame(false);
    setRoomId("");
    setSelectedMove("");
    setWaitingForOpponent(false);
  };

  // Quitter la partie
  const leaveGame = () => {
    setIsInGame(false);
    setRoomId("");
    setGameState({
      players: [],
      gameData: { rounds: [], choices: {} },
      isFinished: false,
      winner: null
    });
    setSelectedMove("");
    setWaitingForOpponent(false);
  };

    // Jouer un coup
    const makeMove = (move) => {
      if (!socket || !roomId || !user || !user._id || gameState.isFinished) return;
      setSelectedMove(move);
      setWaitingForOpponent(true);
      socket.emit('shifumi:play', { roomId, userId: user._id, move });
    };

  // Vérifier si le joueur a déjà joué
  const hasPlayerPlayed = () => {
    return gameState.gameData.choices[user && user._id] !== undefined;
  };

   // Calculer le score
   const getScore = () => {
    const scores = {};
    gameState.players.forEach(player => {
      scores[player.userId] = 0; // Utiliser player.userId
    });
    gameState.gameData.rounds.forEach(round => {
      if (round.winner) {
        scores[round.winner] = (scores[round.winner] || 0) + 1;
      }
    });
    return scores;
  };
  
  if (!isConnected) {
    return (
      <div className="shifumi-center">
        <div>Connexion au serveur...</div>
      </div>
    );
  }

  if (!isInGame) {
    return (
      <div className="shifumi-center">
        <h2 className="shifumi-header-title">Pierre, Feuille, Ciseaux</h2>
        <div className="shifumi-header-info">
          <input
            type="text"
            placeholder="Nom de la partie"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="shifumi-input"
          />
          <button
            onClick={joinGame}
            disabled={!roomId.trim()}
            className="shifumi-join-btn"
          >
            Rejoindre
          </button>
        </div>
      </div>
    );
  }

  if (gameState.players.length < 2) {
    return (
      <div className="shifumi-center">
        <h3>En attente d'un adversaire...</h3>
        <div className="shifumi-header-info">
          Partie: <strong>{roomId}</strong>
        </div>
        <button
          onClick={leaveGame}
          className="shifumi-leave-btn"
        >
          Quitter
        </button>
      </div>
    );
  }

  const scores = getScore();
  let currentRound;
  if (gameState.isFinished) {
    currentRound = gameState.gameData.rounds.length;
  } else {
    currentRound = gameState.gameData.rounds.length + 1;
  }

  return (
    <div className="shifumi-center">
      <div className="shifumi-header">
        <h2 className="shifumi-header-title">Pierre, Feuille, Ciseaux</h2>
        <div className="shifumi-header-info">
          Manche {currentRound}/3 • Partie: {roomId}
        </div>
        <div className="shifumi-header-scores">
          {gameState.players.map((player) => (
            <div key={player.userId} className="shifumi-header-player">
              <div className={user && player.userId === user._id ? "shifumi-header-player-name" : undefined}>
                {player.userId === user?._id ? 'Vous' : player.pseudo}
              </div>
              <div className="shifumi-header-player-score">
                {scores[player.userId] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {gameState.isFinished && (
        <div className="shifumi-final">
          <h3 className="shifumi-final-title">
            {user?._id === gameState.winner ? ' Vous avez gagné !' :
              gameState.winner ? ' Vous avez perdu...' :
                ' Match nul !'}
          </h3>
          <button
            onClick={newGame}
            className="shifumi-final-btn"
          >
            Nouvelle partie
          </button>
        </div>
      )}

      {/* Interface de jeu */}
      {!gameState.isFinished && (
        <div>
          <div className="shifumi-header-info">
            {waitingForOpponent ? (
              <div className="shifumi-waiting">
                En attente de l'adversaire...
                <div className="shifumi-waiting-choice">
                  Votre choix: {CHOICES.find(c => c.value === selectedMove)?.emoji}
                </div>
              </div>
            ) : hasPlayerPlayed() ? (
              <div className="shifumi-waiting">
                En attente de l'adversaire...
                <div className="shifumi-waiting-choice">
                  Votre choix: {CHOICES.find(c => c.value === gameState.gameData.choices[user?._id])?.emoji}
                </div>
              </div>
            ) : (
              <div>Choisissez votre coup:</div>
            )}
          </div>

          <div className="shifumi-choices">
            {CHOICES.map((choice) => (
              <button
                key={choice.value}
                className={`shifumi-btn${selectedMove === choice.value ? ' shifumi-btn-selected' : ''}`}
                onClick={() => makeMove(choice.value)}
                disabled={hasPlayerPlayed() || waitingForOpponent || gameState.isFinished}
              >
                <span className="shifumi-emoji">{choice.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Historique des manches */}
      {gameState.gameData.rounds.length > 0 && (
        <div className="shifumi-history">
          <h4 className="shifumi-history-title">Historique</h4>
          <div className="shifumi-history-list">
            {gameState.gameData.rounds.map((round, index) => {
              const opponent = gameState.players.find(p => p.userId !== user?._id);
              return (
                <div key={index} className="shifumi-history-round">
                  <div>Manche {index + 1}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{CHOICES.find(c => c.value === round.choices[user?._id])?.emoji}</span>
                    <span>vs</span>
                    <span>{CHOICES.find(c => c.value === round.choices[opponent?.userId])?.emoji}</span>
                  </div>
                  <div className={
                    round.winner === user?._id ? 'shifumi-history-round-won' :
                      round.winner ? 'shifumi-history-round-lost' : 'shifumi-history-round-draw'
                  }>
                    {round.winner === user?._id ? 'Gagné' :
                      round.winner ? 'Perdu' : 'Égalité'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={leaveGame}
          className="shifumi-leave-btn"
        >
          Quitter la partie
        </button>
      </div>
    </div>
  );
};

export default Shifumi;