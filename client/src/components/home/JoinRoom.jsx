import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { AuthContext } from "../../context/AuthContext";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const hasNavigated = useRef(false); // Add this ref
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const hasJoined = useRef(false); // Track if we've joined the room

  const handleJoin = () => {
    if (!roomCode || roomCode.trim().length !== 6) {
      alert("Please enter a valid 6-letter room code.");
      return;
    }

    // Only join if we haven't already
    if (!hasJoined.current) {
      socket.emit("join-room", { 
        roomCode, 
        userId: user._id 
      });
      hasJoined.current = true;
      setJoined(true);
      localStorage.setItem("roomCode", roomCode);
    }
  };

  useEffect(() => {
    const handlePlayersReady = ({ players, roomCode }) => {
      localStorage.setItem("isCreator", "false");
      localStorage.setItem("roomCode", roomCode);

      hasNavigated.current = true; // Mark navigation
      navigate("/roomToss", { 
        state: { 
          players,
          roomCode 
        } 
      });
    };

    socket.on("players-ready", handlePlayersReady);
    socket.on("room-full", () => setError("❌ Room is already full."));
    socket.on("already-in-room", () => setError("⚠️ You're already in this room"));

    return () => {
      socket.off("players-ready", handlePlayersReady);
      socket.off("room-full");
      socket.off("already-in-room");
    };
  }, [navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomCode && joined && !hasNavigated.current) {
        socket.emit("leave-room", roomCode);
        localStorage.removeItem("roomCode");
      }
    };
  }, [roomCode, joined]);

  return (
    <div className="home-container">
    <div className="box">
      
      <h2>🎮 Join Room</h2>
      <div className="no_of">
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        className="room-code-input"
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
      />
      </div>
      <button onClick={handleJoin} className="butt">Join</button>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
    </div>
  );
};

export default JoinRoom;