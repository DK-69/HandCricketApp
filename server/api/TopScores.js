import { PlayerDetails } from "../models/PlayerDetails.js";
import mongoose from "mongoose";

// ✅ Route: GET /top-scores
export const getTopScores = async (req, res) => {
  try {
    const topPlayers = await PlayerDetails.aggregate([
      {
        $project: {
          userId: 1,
          maxScore: { $max: ["$easy.runs", "$medium.runs", "$hard.runs", "$total.runs"] }
        }
      },
      { $sort: { maxScore: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(topPlayers);
  } catch (err) {
    console.error("❌ Error fetching top scores:", err);
    res.status(500).json({ error: "Failed to fetch top scores" });
  }
};

// ✅ Route: GET /profile/:userId
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await PlayerDetails.findOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        battingMoves: 0,
        bowlingMoves: 0,
        __v: 0,
        _id: 0
      }
    );

    if (!profile) return res.status(404).json({ error: "User not found" });

    res.status(200).json(profile);
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
