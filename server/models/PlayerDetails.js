import mongoose from "mongoose";

const statModeSchema = new mongoose.Schema({
  games: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wicketsUsed: { type: Number, default: 0 },
  tossesWon: { type: Number, default: 0 },
  runsLeaked: { type: Number, default: 0 },
  wicketsTaken: { type: Number, default: 0 }
}, { _id: false });

const playerDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  total: { type: statModeSchema, default:{}},
  easy: { type: statModeSchema, default: {} },
  medium: { type: statModeSchema, default: {} },
  hard: { type: statModeSchema, default:{}},
  pvp: { type: statModeSchema, default:{}},
  battingMoves: { type: [Number], default: [] },
  bowlingMoves: { type: [Number], default: [] },
  matchIds: { type: [mongoose.Schema.Types.ObjectId], default: [] }
});

export const PlayerDetails = mongoose.model("playerdetails", playerDetailsSchema);
