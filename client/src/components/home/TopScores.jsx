import { useEffect, useState } from "react";
import { getTopScores, getPlayerDetails } from "../../api/auth";
import styles from "./TopScores.module.css";
import { UserProfileCard } from "./UserProfileCard";

export const TopScores = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const data = await getTopScores();
        setTopPlayers(data);
      } catch (error) {
        console.error("❌ Failed to fetch top scores:", error);
      }
    };
    fetchTopPlayers();
  }, []);

  const handleProfileClick = async (userId) => {
    try {
      setLoading(true);
      const profileData = await getPlayerDetails(userId); // <<=== Using this
      setSelectedProfile(profileData);
    } catch (err) {
      console.error("❌ Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["topscore-wrapper"]}>
      <h2 className={styles["topscore-heading"]}>🏆 Top 5 Scores</h2>

      {topPlayers.map((player, index) => (
        <div key={player.userId} className={styles["topscore-user"]}>
          <span className={styles["topscore-rank"]}>#{index + 1}</span>
          <button
            className={styles["topscore-userid-btn"]}
            onClick={() => handleProfileClick(player.userId)}
          >
            {player.userId}
          </button>
          <span className={styles["topscore-runs"]}>{player.maxScore} runs</span>
        </div>
      ))}

      {loading && <p className={styles["topscore-loading"]}>Loading profile...</p>}

      {selectedProfile && (
        <div className={styles["topscore-profile-container"]}>
          <UserProfileCard profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        </div>
      )}
    </div>
  );
};
