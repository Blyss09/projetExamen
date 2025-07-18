import mongoose from "mongoose";
const { Schema } = mongoose;

const gameSchema = new Schema({
    gameType: {
      type: String,
      enum: ['morpion', 'pendu', 'shifumi'], 
      required: true
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'finished'],
      default: 'waiting'
    },
    players: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      role: String, // 'X', 'O' pour morpion, 'guesser' pour pendu
      score: { type: Number, default: 0 }
    }],
    currentPlayer: { type: Schema.Types.ObjectId, ref: 'User' },
    gameData: {
      type: Schema.Types.Mixed, 
      default: {}
    },
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    moves: [{
      player: { type: Schema.Types.ObjectId, ref: 'User' },
      move: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now }
    }],
    maxPlayers: { type: Number, default: 2 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });

const gameModel = mongoose.model('Game', gameSchema);
export default gameModel;