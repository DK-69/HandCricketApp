// server/ml/predict.js

// For now, just return a random number (1 to 6)
export const getMLPrediction = (movesSoFar = []) => {
  return Math.floor(Math.random() * 6) + 1;
};
