import styles from './Toss.module.css';

export const TossSelection = ({ onSelect }) => (
  <div className={styles.phaseContainer}>
    <h2 className={styles.phaseTitle}>Call Heads or Tails</h2>
    <div className={styles.tossOptions}>
      <button 
        className={styles.tossButton} 
        onClick={() => onSelect('heads')}
      >
        <img src="heads.png" alt="Heads" className={styles.tossImage} />
        <span className={styles.optionLabel}>Heads</span>
      </button>
      <button 
        className={styles.tossButton} 
        onClick={() => onSelect('tails')}
      >
        <img src="tails.png" alt="Tails" className={styles.tossImage} />
        <span className={styles.optionLabel}>Tails</span>
      </button>
    </div>
  </div>
);