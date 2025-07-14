import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIO from "./SocketIO";
import { TopScores } from "./TopScores";

const HomePage = () => {
  const [playerCount, setPlayerCount] = useState("");
  const navigate = useNavigate();

  const handlePlay = () => {
    const count = parseInt(playerCount);

    if (isNaN(count)) {
      alert("Please enter a number.");
      return;
    }

    if (count <= 0 || count > 11) {
      alert("Please select a number between 1 and 11.");
      return;
    }

    localStorage.setItem("no_of_players", count);
    navigate("/gameMode");
  };

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleJoinRoom = () => {
    navigate("/join-room");
  };

  return (
    <div className="home-container">
      {/* Left Box: Create Room */}
      <div className="create-room">
        <h2>Create Room</h2>
        <p className="startapvp">Start a PvP match by creating a room.</p>
        <SocketIO />
        <button className="butt" onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>

      {/* Center Box: Player Count */}
      <div className="box">
        <center>
          <div className="wname">WELCOME TO MY GAME<br /></div>
          <br />
          <div className="no_of">
            <p className="a21">Select number of players:</p>
            <input
              type="number"
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              placeholder="Enter a number (1-11)"
              className="number-input"
              min="1"
              max="11"
            />
          </div>
          <br />
          <button className="butt" onClick={handlePlay}>
            LET'S PLAY!
          </button>
          <br /><br />
          <button className="butt" onClick={handleJoinRoom}>
            Join Room
          </button>
        </center>
      </div>

      {/* Right Box: Highest Scores */}
      <div className="high-scores">
        <TopScores/>
      </div>
    </div>
  );
};

export default HomePage;
