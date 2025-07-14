import mongoose from "mongoose";

const inningsSchema = new mongoose.Schema({
  battingBy: String, // 'user' or 'computer'
  score: Number,
  wickets: Number,
  maxWickets: Number,
  completed: Boolean,
  target: Number,
  battingMoves: [Number],
  bowlingMoves: [Number]
}, { _id: false });

const matchDetailsSchema = new mongoose.Schema({
  player1_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  player2_id: { type: mongoose.Schema.Types.Mixed, default: null },

  mode: String,  // 'easy' | 'medium' | 'hard' | 'pvp'
  tossWinner: String,
  battingFirst: String,
  bowlingFirst: String,
  winner: String,
  playersPerTeam: Number,
  matchCompleted: Boolean,
  firstInnings: inningsSchema,
  secondInnings: inningsSchema,
}, { timestamps: true });

export const MatchDetails = mongoose.model("matchdetails", matchDetailsSchema);
