// server/api/MLController.js
export const predictMove = async (req, res) => {
  try {
    const { battingMoves, bowlingMoves } = req.body;
    
    // For now, return a dummy prediction (random 1-6)
    const predictedMove = Math.floor(Math.random() * 6) + 1;
    
    res.json({ move: predictedMove });
  } catch (err) {
    console.error("❌ ML prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
};