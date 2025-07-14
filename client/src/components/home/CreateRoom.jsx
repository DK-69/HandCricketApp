import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { AuthContext } from "../../context/AuthContext";

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
const generateMatchId = () => {
  return `match_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
};

const CreateRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const hasNavigated = useRef(false);
  const hasJoined = useRef(false);
  const roomCodeRef = useRef(""); // ✅ to track current roomCode in cleanup

  // Generate room code on mount
  useEffect(() => {
    const newCode = generateRoomCode();
    setRoomCode(newCode);
    roomCodeRef.current = newCode;

    return () => {
      if (hasJoined.current && !hasNavigated.current) {
        socket.emit("leave-room", roomCodeRef.current); // ✅ corrected
      }
    };
  }, [user]);

  const handleConfirm = () => {
    const count = parseInt(playerCount);
    if (isNaN(count) || count <= 0 || count > 11) {
      setErrorMessage("Enter valid number of players (1–11)");
      return;
    }

    setErrorMessage("");
    localStorage.setItem("isCreator", "true");
    localStorage.setItem("roomCode", roomCode);

    socket.emit("join-room", {
      roomCode,
      userId: user._id,
      playerCount: count
    });

    hasJoined.current = true; // ✅ this is crucial
    setWaitingForOpponent(true);
  };

  useEffect(() => {
    const handlePlayerJoined = () => {
      console.log("✅ Opponent joined!");
    };

    const handlePlayersReady = ({ players, roomCode, playerCount }) => {
      console.log("🚀 Both players ready");
      hasNavigated.current = true;
      navigate("/roomToss", {
        state: {
          players,
          roomCode,
          playerCount
        }
      });
    };

    const handleRoomFull = () => {
      setErrorMessage("Room is full. Please create a new room.");
      setWaitingForOpponent(false);
    };

    const handleSelfJoin = () => {
      setErrorMessage("You cannot join your own room from multiple tabs.");
      setWaitingForOpponent(false);
    };

    socket.on("player-joined", handlePlayerJoined);
    socket.on("players-ready", handlePlayersReady);
    socket.on("room-full", handleRoomFull);
    socket.on("self-join", handleSelfJoin);

    return () => {
      socket.off("player-joined", handlePlayerJoined);
      socket.off("players-ready", handlePlayersReady);
      socket.off("room-full", handleRoomFull);
      socket.off("self-join", handleSelfJoin);
    };
  }, [navigate, roomCode, playerCount]);

  // Handle browser/tab close
  useEffect(() => {
    const handleUnload = () => {
      if (hasJoined.current && !hasNavigated.current) {
        socket.emit("leave-room", roomCodeRef.current);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="home-container">
    <div className="box">
      <h2>🛡️ Room Created</h2>
      <p>
        <b>Room Code:</b> <span className="room-code-for-joining">{roomCode}</span>
      </p>

      <div className="no_of">
      <input
        type="number"
        value={playerCount}
        onChange={(e) => setPlayerCount(e.target.value)}
        placeholder="Enter number of players"
        min="1"
        max="11"
        className="number-input"
      />
      </div>
      <button onClick={handleConfirm} className="butt">Confirm</button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {waitingForOpponent && <p>⏳ Waiting for opponent to join...</p>}
    </div>
    </div>
  );
};

export default CreateRoom;
