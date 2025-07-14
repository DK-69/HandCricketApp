const ScorecardModal = ({ score, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <a href="#" className="close-button" onClick={onClose}>&times;</a>
        <div className="scoreboard">
          <h2>Scorecard</h2>
          <p>Your score: <span className="score">{score}</span></p>
          <button onClick={onClose} className="continue-btn">Continue Game</button>
        </div>
      </div>
    </div>
  );
};

export default ScorecardModal;