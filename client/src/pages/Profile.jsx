import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getPlayerDetails } from "../api/auth.jsx";


const Profile = () => {
  const { user } = useContext(AuthContext);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlayerDetails(user._id); // Your backend should support this
        setPlayer(data);
      } catch (err) {
        console.error("Error fetching player details:", err);
      }
    };

    if (user?._id) fetchData();
  }, [user]);

  if (!player) {
    return <div className="page-container">Loading profile...</div>;
  }

  const renderStats = (stats) => (
    <ul>
      <li><strong>Games:</strong> {stats.games}</li>
      <li><strong>Wins:</strong> {stats.wins}</li>
      <li><strong>Losses:</strong> {stats.losses}</li>
      <li><strong>Runs Scored:</strong> {stats.runs}</li>
      <li><strong>Wickets Used:</strong> {stats.wicketsUsed}</li>
      <li><strong>Wickets Taken:</strong> {stats.wicketsTaken}</li>
      <li><strong>Runs Leaked:</strong> {stats.runsLeaked}</li>
      <li><strong>Tosses Won:</strong> {stats.tossesWon}</li>
    </ul>
  );

  return (
    <div className="page-container">
      <h1 className="profile-title">Player Profile</h1>
      <div className="profile-info">
        <p><strong>User ID:</strong> {player.userId}</p>
        <p><strong>Total Matches Played:</strong> {player.matchIds.length}</p>
      </div>

      <div className="stats-section">
        <h2>Total Stats</h2>
        {renderStats(player.total)}

        <h2>Easy Mode</h2>
        {renderStats(player.easy)}

        <h2>Medium Mode</h2>
        {renderStats(player.medium)}

        <h2>Hard Mode</h2>
        {renderStats(player.hard)}

        <h2>Player vs Player (PvP)</h2>
        {renderStats(player.pvp)}
      </div>
    </div>
  );
};

export default Profile;
