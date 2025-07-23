import UserModel from '../models/users.model.js';
import gameModel from '../models/game.model.js';

class ShifumiController {
    // Initialise les données de jeu pour Shifumi
    initializeGameData() {
        return { rounds: [], choices: {} };
    }

    // Valide le coup 
    isValidMove(game, move) {
        const validMoves = ["pierre", "feuille", "ciseaux"];
        return validMoves.includes(move);
    }

    // Applique le coup
    applyMove(game, move, userId) {
        if (!game.gameData.choices) game.gameData.choices = {};
        game.gameData.choices[userId] = move;
    }

    // Créer une nouvelle partie
    async createGame(roomId, createdBy) {
        try {
            const newGame = new gameModel({
                gameType: 'shifumi',
                status: 'waiting',
                players: [],
                gameData: this.initializeGameData(),
                maxPlayers: 2,
                createdBy: createdBy
            });
            
            const savedGame = await newGame.save();
            console.log(`Partie Shifumi créée en base avec l'ID: ${savedGame._id}`);
            return savedGame;
        } catch (error) {
            console.error('Erreur lors de la création de la partie:', error);
            return null;
        }
    }

    // Ajouter un joueur à la partie
    async addPlayer(gameId, userId) {
        try {
            const game = await gameModel.findById(gameId);
            if (!game) return null;

            // Vérifier si le joueur n'est pas déjà dans la partie
            const playerExists = game.players.some(p => p.user.toString() === userId);
            if (!playerExists) {
                game.players.push({
                    user: userId,
                    role: game.players.length === 0 ? 'player1' : 'player2',
                    score: 0
                });

                // Changer le statut si on a 2 joueurs
                if (game.players.length === 2) {
                    game.status = 'in-progress';
                }

                await game.save();
                console.log(`Joueur ${userId} ajouté à la partie ${gameId}`);
            }
            
            return game;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du joueur:', error);
            return null;
        }
    }

    // Enregistrer un coup en base
    async saveMove(gameId, userId, move) {
        try {
            const game = await gameModel.findById(gameId);
            if (!game) return null;

            // Ajouter le coup aux moves
            game.moves.push({
                player: userId,
                move: move,
                timestamp: new Date()
            });

            // Mettre à jour gameData
            if (!game.gameData.choices) {
                game.gameData.choices = {};
            }
            game.gameData.choices[userId] = move;

            await game.save();
            return game;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du coup:', error);
            return null;
        }
    }

    // Terminer une manche et mettre à jour la DB
    async completeRound(gameId, roundResult) {
        try {
            const game = await gameModel.findById(gameId);
            if (!game) return null;

            // Ajouter la manche aux rounds
            if (!game.gameData.rounds) {
                game.gameData.rounds = [];
            }
            game.gameData.rounds.push(roundResult);

            // Mettre à jour les scores des joueurs
            if (roundResult.winner) {
                const playerIndex = game.players.findIndex(p => p.user.toString() === roundResult.winner);
                if (playerIndex !== -1) {
                    game.players[playerIndex].score += 1;
                }
            }

            // Réinitialiser les choix pour la prochaine manche
            game.gameData.choices = {};

            await game.save();
            return game;
        } catch (error) {
            console.error('Erreur lors de la finalisation de la manche:', error);
            return null;
        }
    }

    // Terminer la partie en base
    async finishGame(gameId, winnerId) {
        try {
            const game = await gameModel.findById(gameId);
            if (!game) return null;

            game.status = 'finished';
            game.winner = winnerId || null;

            await game.save();
            console.log(`Partie ${gameId} terminée. Gagnant: ${winnerId || 'Aucun'}`);
            return game;
        } catch (error) {
            console.error('Erreur lors de la finalisation de la partie:', error);
            return null;
        }
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
            
            // Créer l'objet round
            const roundResult = {
                choices: { ...choices },
                winner
            };
            
            // On ajoute la manche aux rounds
            game.gameData.rounds.push(roundResult);
            // On réinitialise les choix pour la prochaine manche
            game.gameData.choices = {};
            
            // Fin de partie après un certain nombre de manches 
            if (game.gameData.rounds.length >= 3) {
                // Initialiser les scores à 0 pour chaque joueur
                const scores = {};
                for (const id of players) {
                  scores[id] = 0;
                }
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
                return { isFinished: true, winner: finalWinner, roundResult };
            }
            return { isFinished: false, roundResult };
        }
        return { isFinished: false };
    }
}

// Stockage en mémoire des parties Shifumi
const shifumiGames = {}; 

// Fonction d'initialisation de socket.io pour le Shifumi
export function initShifumiSocket(io) {
    const controller = new ShifumiController();
    
    io.on('connection', (socket) => {
        console.log('Nouveau client connecté au Shifumi :', socket.id);

        // Un joueur rejoint une partie
        socket.on('shifumi:join', async ({ roomId, userId }) => {
            socket.join(roomId);
            
            // Si la partie n'existe pas, on la crée
            if (!shifumiGames[roomId]) {
                // Créer la partie en base de données
                const dbGame = await controller.createGame(roomId, userId);
                if (!dbGame) {
                    socket.emit('shifumi:error', { message: 'Erreur lors de la création de la partie' });
                    return;
                }
                
                shifumiGames[roomId] = {
                    players: [], 
                    gameData: { rounds: [], choices: {} },
                    isFinished: false,
                    winner: null,
                    dbId: dbGame._id 
                };
            }
            
            // Récupérer le pseudo depuis la base
            let pseudo = 'Inconnu';
            try {
                const user = await UserModel.findById(userId);
                if (user && user.pseudo) pseudo = user.pseudo;
            } catch (e) { /* ignore erreur */ }
            
            // Ajoute le joueur s'il n'est pas déjà dans la partie
            if (!shifumiGames[roomId].players.find(p => p.userId === userId)) {
                shifumiGames[roomId].players.push({ userId, pseudo, socketId: socket.id });
                
                // Ajouter le joueur en base
                await controller.addPlayer(shifumiGames[roomId].dbId, userId);
            }
            
            // Informe tous les joueurs de l'état de la partie
            io.to(roomId).emit('shifumi:update', {
                players: shifumiGames[roomId].players.map(p => ({ userId: p.userId, pseudo: p.pseudo })),
                gameData: shifumiGames[roomId].gameData,
                isFinished: shifumiGames[roomId].isFinished,
                winner: shifumiGames[roomId].winner
            });
            console.log('Joueurs dans la room', roomId, ':', shifumiGames[roomId].players.map(p => p.userId));
        });

        // Un joueur joue un coup
        socket.on('shifumi:play', async ({ roomId, userId, move }) => {
            const game = shifumiGames[roomId];
            if (!game || game.isFinished) return;
            
            // Vérifie la validité du coup
            if (!controller.isValidMove(game, move)) return;
            
            // Enregistrer le coup en base
            await controller.saveMove(game.dbId, userId, move);
            
            // Applique le coup en mémoire
            controller.applyMove(game, move, userId);
            
            // Vérifie si la manche/partie est terminée
            const endStatus = controller.checkGameEnd(game);
            
            if (endStatus.roundResult) {
                // Sauvegarder la manche en base
                await controller.completeRound(game.dbId, endStatus.roundResult);
            }
            
            if (endStatus.isFinished) {
                game.isFinished = true;
                game.winner = endStatus.winner;
                
                // Terminer la partie en base
                await controller.finishGame(game.dbId, endStatus.winner);
                
                // Suppression automatique de la partie en mémoire après 5 secondes
                setTimeout(() => {
                    delete shifumiGames[roomId];
                }, 5000);
            }
            
            // Diffuse l'état du jeu à tous les joueurs de la room
            io.to(roomId).emit('shifumi:update', {
                players: game.players.map(p => ({ userId: p.userId, pseudo: p.pseudo })),
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
                    // Si aucun joueur on supprime la room
                    if (game.players.length === 0) {
                        delete shifumiGames[roomId];
                    } else {
                        // Sinon on met à jour les autres joueurs
                        io.to(roomId).emit('shifumi:update', {
                            players: game.players.map(p => ({ userId: p.userId, pseudo: p.pseudo })),
                            gameData: game.gameData,
                            isFinished: game.isFinished,
                            winner: game.winner
                        });
                    }
                }
            }
        });
    });
} 

const shifumiController = new ShifumiController();
export default shifumiController;