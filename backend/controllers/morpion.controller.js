class MorpionController {
    // Initialise la grille vide
    initializeGameData() {
        return { board: [["", "", ""], ["", "", ""], ["", "", ""]], moves: [] };
    }

    // Détermine le rôle du joueur selon son index
    getPlayerRole(index) {
        return index === 0 ? "X" : "O";
    }

    // Vérifie si c'est le tour du joueur
    isPlayerTurn(game, userId) {
        return game.currentPlayer && game.currentPlayer.toString() === userId;
    }

    // Valide le coup (case vide et coordonnées valides)
    isValidMove(game, move) {
        const { row, col } = move;
        if (row < 0 || row > 2 || col < 0 || col > 2) return false;
        return game.gameData.board[row][col] === "";
    }

    // Applique le coup sur la grille
    applyMove(game, move, userId) {
        const player = game.players.find(p => p.user.toString() === userId);
        if (!player) return;
        const symbol = player.role;
        game.gameData.board[move.row][move.col] = symbol;
        game.moves.push({ player: userId, move });
        // Marque le champ gameData comme modifié pour que Mongoose le sauvegarde
        game.markModified('gameData');
    }

    // Vérifie la fin de partie (victoire ou match nul)
    checkGameEnd(game) {
        const board = game.gameData.board;
        // Vérifie les lignes, colonnes et diagonales
        const lines = [
            ...board,
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ];
        for (const line of lines) {
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                // Trouve le joueur gagnant
                const winner = game.players.find(p => p.role === line[0]);
                return { isFinished: true, winner: winner ? winner.user : null };
            }
        }
        // Match nul si toutes les cases sont remplies
        const isDraw = board.flat().every(cell => cell !== "");
        if (isDraw) return { isFinished: true, winner: null };
        return { isFinished: false };
    }

    // Détermine le prochain joueur
    getNextPlayer(game, userId) {
        const idx = game.players.findIndex(p => p.user.toString() === userId);
        const nextIdx = (idx + 1) % game.players.length;
        return game.players[nextIdx].user;
    }
}

const morpionController = new MorpionController();
export default morpionController; 