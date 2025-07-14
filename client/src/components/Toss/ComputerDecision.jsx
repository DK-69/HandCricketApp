import styles from './Toss.module.css';

export const ComputerDecision = ({ choice }) => (
  <div className={styles.phaseContainer}>
    <h2 className={styles.phaseTitle}>Computer Won the Toss</h2>
    <div className={styles.computerDecision}>
      <p className={styles.decisionText}>
        Opponent chose to <span className={styles.highlight}>
          {choice === 1 ? 'Bat' : 'Bowl'}
        </span> first
      </p>
      <div className={styles.computerChoiceDisplay}>
        <img 
          src={choice === 1 ? "batting.jpg" : "bowling.jpg"} 
          alt={choice === 1 ? "Batting" : "Bowling"} 
          className={styles.computerChoiceImage}
        />
      </div>
    </div>
  </div>
);