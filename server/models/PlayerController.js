import { PlayerDetails } from "../models/PlayerDetails.js";
import mongoose from "mongoose";

export const getPlayerDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const player = await PlayerDetails.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
