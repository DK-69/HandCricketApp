import { MatchDetails } from "../models/matchDetails.js";
import { PlayerDetails } from "../models/PlayerDetails.js";
import mongoose from "mongoose";

export const saveMatch = async (req, res) => {
  try {
    const matchData = req.body;
    console.log("✅ Received match data:");

    // 1. Save match
    const savedMatch = await MatchDetails.create(matchData);

    // 2. Extract fields
    const {
      player1_id,
      player2_id,
      mode,
      winner,
      tossWinner,
      firstInnings,
      secondInnings
    } = matchData;

    // 3. Helper to update any player's stats
    const updatePlayerStats = async (playerId, isUser) => {
      const userInnings = firstInnings.battingBy === (isUser ? "user" : "opponent") ? firstInnings : secondInnings;
      const opponentInnings = firstInnings.battingBy === (isUser ? "opponent" : "user") ? firstInnings : secondInnings;

      const isPlayerWinner = winner === (isUser ? "user" : "opponent");
      const didWinToss = tossWinner === (isUser ? "user" : "opponent");

      const statsUpdate = {
        $push: {
          battingMoves: { $each: [...firstInnings.battingMoves, ...secondInnings.battingMoves] },
          bowlingMoves: { $each: [...firstInnings.bowlingMoves, ...secondInnings.bowlingMoves] },
          matchIds: savedMatch._id
        },
        $inc: {
          [`${mode}.games`]: 1,
          [`${mode}.wins`]: isPlayerWinner ? 1 : 0,
          [`${mode}.losses`]: isPlayerWinner ? 0 : 1,
          [`${mode}.tossesWon`]: didWinToss ? 1 : 0,
          [`${mode}.runs`]: userInnings.score,
          [`${mode}.wicketsUsed`]: userInnings.wickets,
          [`${mode}.runsLeaked`]: opponentInnings.score,
          [`${mode}.wicketsTaken`]: opponentInnings.wickets,

          "total.games": 1,
          "total.wins": isPlayerWinner ? 1 : 0,
          "total.losses": isPlayerWinner ? 0 : 1,
          "total.tossesWon": didWinToss ? 1 : 0,
          "total.runs": userInnings.score,
          "total.wicketsUsed": userInnings.wickets,
          "total.runsLeaked": opponentInnings.score,
          "total.wicketsTaken": opponentInnings.wickets
        }
      };

      await PlayerDetails.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(playerId) },
        statsUpdate,
        { upsert: true }
      );
    };

    // 4. Always update player1
    await updatePlayerStats(player1_id, true);

    // 5. If PvP mode, update player2 also
    if (mode === "pvp" && player2_id) {
      await updatePlayerStats(player2_id, false);
    }

    // 6. Done
    res.status(200).json({
      message: "✅ Match saved & player stats updated",
      matchId: savedMatch._id
    });

  } catch (err) {
    console.error("❌ Error saving match:", err);
    res.status(500).json({ error: "Failed to save match" });
  }
};
