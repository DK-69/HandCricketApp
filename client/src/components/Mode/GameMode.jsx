import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./GameMode.module.css";

export const GameMode = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (mode) => {
    setSelected(mode);
    setTimeout(() => {
      navigate("/toss", { state: { gameMode: mode } });
    }, 1000);
  };

  return (
    <div className={styles.container}>
      {/* ✅ Transparent box over background */}
      <div className={styles.transparent}>
        <div className={styles.phaseContainer}>
          <h1 className={styles.phaseTitle}>Select Game Mode</h1>
          <div className={styles.modeOptions}>
            <div
              className={`${styles.modeBox} ${styles.easy} ${
                selected === "easy" ? styles.selected : ""
              }`}
              onClick={() => handleSelect("easy")}
            >
              Easy
            </div>
            <div
              className={`${styles.modeBox} ${styles.medium} ${
                selected === "medium" ? styles.selected : ""
              }`}
              onClick={() => handleSelect("medium")}
            >
              Medium
            </div>
            <div
              className={`${styles.modeBox} ${styles.hard} ${
                selected === "hard" ? styles.selected : ""
              }`}
              onClick={() => handleSelect("hard")}
            >
              Hard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
