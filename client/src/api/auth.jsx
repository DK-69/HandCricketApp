export const loginUser = async (email, password) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signupUser = async (email, password) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json(); // You can log or return this if needed
};

export const checkUser = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkUser`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
};

// auth.jsx
export const saveMatch = async (matchState) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(matchState),
  });

  return res.json(); // Make sure your backend always returns JSON
};


export const getPlayerDetails = async (userId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/player/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
};

export const getPredictedMove = async (battingMoves, bowlingMoves,userId,level,isComputerBatting) => {
  console.log(battingMoves,bowlingMoves);
  const res = await fetch(`${import.meta.env.VITE_ML}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ battingMoves, bowlingMoves,userId,level,isComputerBatting}),
  });

  const data = await res.json();
  console.log("ML Prediction:", data);
  return data.move;
};


export const getTopScores = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/top-scores`);
    if (!res.ok) throw new Error("Failed to fetch top scores");
    const data = await res.json();
    return data; 
  } catch (err) {
    console.error("❌ getTopScores error:", err);
    return [];
  }
};

