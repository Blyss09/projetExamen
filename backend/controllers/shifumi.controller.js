class ShifumiController {
    // Initialise les données de jeu pour Shifumi
    initializeGameData() {
        return { rounds: [], choices: {} };
    }

    // Détermine le rôle du joueur 
    getPlayerRole(index) {
        return `player${index + 1}`;
    }

    // Vérifie si c'est le tour du joueur (tous les joueurs doivent jouer à chaque manche)
    isPlayerTurn(game, userId) {
        // Si le joueur n'a pas encore joué ce round
        const currentRound = game.gameData.rounds.length;
        return !game.gameData.choices[userId];
    }

    // Valide le coup (doit être pierre, feuille ou ciseaux)
    isValidMove(game, move) {
        const validMoves = ["pierre", "feuille", "ciseaux"];
        return validMoves.includes(move);
    }

    // Applique le coup (enregistre le choix du joueur)
    applyMove(game, move, userId) {
        if (!game.gameData.choices) game.gameData.choices = {};
        game.gameData.choices[userId] = move;
    }

    // Vérifie la fin de la manche et détermine le gagnant de la manche
    checkGameEnd(game) {
        const players = game.players.map(p => p.userId);
        const choices = game.gameData.choices;
        if (players.every(id => choices[id])) {
            // Tous les joueurs ont joué, on détermine le gagnant de la manche
            const [id1, id2] = players;
            const move1 = choices[id1];
            const move2 = choices[id2];
            let winner = null;
            if (move1 === move2) {
                winner = null; // Égalité
            } else if (
                (move1 === "pierre" && move2 === "ciseaux") ||
                (move1 === "feuille" && move2 === "pierre") ||
                (move1 === "ciseaux" && move2 === "feuille")
            ) {
                winner = id1;
            } else {
                winner = id2;
            }
            // On ajoute la manche aux rounds
            game.gameData.rounds.push({
                choices: { ...choices },
                winner
            });
            // On réinitialise les choix pour la prochaine manche
            game.gameData.choices = {};
            // Fin de partie après un certain nombre de manches 
            if (game.gameData.rounds.length >= 3) {
                // Compter les victoires
                const scores = {};
                for (const round of game.gameData.rounds) {
                    if (round.winner) {
                        scores[round.winner] = (scores[round.winner] || 0) + 1;
                    }
                }
                // Détermine le gagnant 
                let finalWinner = null;
                if (scores[id1] > scores[id2]) finalWinner = id1;
                else if (scores[id2] > scores[id1]) finalWinner = id2;
                // Partie terminée
                return { isFinished: true, winner: finalWinner };
            }
            return { isFinished: false };
        }
        return { isFinished: false };
    }

    // Le prochain joueur est celui qui n'a pas encore joué ce round
    getNextPlayer(game, userId) {
        const players = game.players.map(p => p.user.toString());
        for (const id of players) {
            if (!game.gameData.choices[id]) return id;
        }
        return null;
    }
}

const shifumiController = new ShifumiController();
export default shifumiController; 

// Stockage en mémoire des parties Shifumi 
const shifumiGames = {};

// Fonction d'initialisation de socket.io pour le jeu Shifumi
export function initShifumiSocket(io) {
    io.on('connection', (socket) => {
        console.log('Nouveau client connecté au Shifumi :', socket.id);

        // Un joueur rejoint une partie (room)
        socket.on('shifumi:join', ({ roomId, userId }) => {
            socket.join(roomId);
            // Si la partie n'existe pas, on la crée
            if (!shifumiGames[roomId]) {
                shifumiGames[roomId] = {
                    players: [], 
                    gameData: { rounds: [], choices: {} },
                    isFinished: false,
                    winner: null
                };
            }
            // Ajoute le joueur s'il n'est pas déjà dans la partie
            if (!shifumiGames[roomId].players.find(p => p.userId === userId)) {
                shifumiGames[roomId].players.push({ userId, socketId: socket.id });
            }
            // Informe tous les joueurs de l'état de la partie
            io.to(roomId).emit('shifumi:update', {
                players: shifumiGames[roomId].players.map(p => p.userId),
                gameData: shifumiGames[roomId].gameData,
                isFinished: shifumiGames[roomId].isFinished,
                winner: shifumiGames[roomId].winner
            });
            console.log('Joueurs dans la room', roomId, ':', shifumiGames[roomId].players.map(p => p.userId));
        });

        // Un joueur joue un coup
        socket.on('shifumi:play', ({ roomId, userId, move }) => {
            const game = shifumiGames[roomId];
            if (!game || game.isFinished) return;
            // Vérifie la validité du coup
            if (!ShifumiController.prototype.isValidMove(game, move)) return;
            // Applique le coup
            ShifumiController.prototype.applyMove(game, move, userId);
            // Vérifie si la manche/partie est terminée
            const endStatus = ShifumiController.prototype.checkGameEnd(game);
            if (endStatus.isFinished) {
                game.isFinished = true;
                game.winner = endStatus.winner;
            }
            // Diffuse l'état du jeu à tous les joueurs de la room
            io.to(roomId).emit('shifumi:update', {
                players: game.players.map(p => p.userId),
                gameData: game.gameData,
                isFinished: game.isFinished,
                winner: game.winner
            });
        });

        // Déconnexion d'un joueur
        socket.on('disconnect', () => {
            console.log('Client déconnecté du Shifumi :', socket.id);
            // Retire le joueur de toutes les parties où il était
            for (const roomId in shifumiGames) {
                const game = shifumiGames[roomId];
                const idx = game.players.findIndex(p => p.socketId === socket.id);
                if (idx !== -1) {
                    game.players.splice(idx, 1);
                    // Si plus de joueurs, on supprime la partie
                    if (game.players.length === 0) {
                        delete shifumiGames[roomId];
                    } else {
                        // Sinon, on met à jour les autres joueurs
                        io.to(roomId).emit('shifumi:update', {
                            players: game.players.map(p => p.userId),
                            gameData: game.gameData,
                            isFinished: game.isFinished,
                            winner: game.winner
                        });
                    }
                }
            }
        });

        // Message de bienvenue (optionnel)
        socket.emit('shifumi:welcome', { message: 'Bienvenue sur le Shifumi en temps réel !' });
    });
} 