import styles from './Toss.module.css';

export const UserChoice = ({ onSelect }) => (
  <div className={styles.phaseContainer}>
    <h2 className={styles.phaseTitle}>You Won! Choose First</h2>
    <div className={styles.choiceButtons}>
      <button 
        className={`${styles.choiceButton} ${styles.batChoice}`} 
        onClick={() => onSelect(1)}
      >
        <img src="batting.jpg" alt="Batting" className={styles.choiceImage} />
        <span className={styles.choiceLabel}>Bat First</span>
      </button>
      <button 
        className={`${styles.choiceButton} ${styles.bowlChoice}`} 
        onClick={() => onSelect(0)}
      >
        <img src="bowling.jpg" alt="Bowling" className={styles.choiceImage} />
        <span className={styles.choiceLabel}>Bowl First</span>
      </button>
    </div>
  </div>
);