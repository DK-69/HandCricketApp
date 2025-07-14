import styles from "./TopScores.module.css";

export const UserProfileCard = ({ profile, onClose }) => {
  return (
    <div className={styles["topscore-profile-card"]}>
      <h3>User Profile</h3>
      <p><strong>User ID:</strong> {profile.userId}</p>
      <p><strong>Total Games:</strong> {profile.total.games}</p>
      <p><strong>Total Wins:</strong> {profile.total.wins}</p>
      <p><strong>Total Losses:</strong> {profile.total.losses}</p>
      <p><strong>Total Runs:</strong> {profile.total.runs}</p>
      <p><strong>Wickets Taken:</strong> {profile.total.wicketsTaken}</p>
      <p><strong>Wickets Used:</strong> {profile.total.wicketsUsed}</p>
      <p><strong>Tosses Won:</strong> {profile.total.tossesWon}</p>
      <button className={styles["topscore-close-btn"]} onClick={onClose}>
        ❌ Close
      </button>
    </div>
  );
};
