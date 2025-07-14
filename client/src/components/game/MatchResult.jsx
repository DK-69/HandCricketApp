import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveMatch } from "../../api/auth";


const MatchResult = ({ matchState, onRestart, myRole }) => {
  const { winner, firstInnings, secondInnings, battingFirst, matchCompleted } = matchState;
  const navigate = useNavigate();
  const hasSaved = useRef(false);
  // console.log(matchState);
  useEffect(() => {
    if (matchCompleted && !hasSaved.current) {
      hasSaved.current = true;

      const sendMatchToBackend = async () => {
        try {
          const result = await saveMatch(matchState);
          console.log("✅ Match saved:", result);
        } catch (error) {
          console.error("❌ Error saving match:", error);
        }
      };

      sendMatchToBackend();
    }
  }, []);

  // 🛠 Normalize for case mismatches
  const isUserWinner = winner?.toLowerCase() === myRole?.toLowerCase();
  const isUserBattingFirst = battingFirst?.toLowerCase() === myRole?.toLowerCase();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="match-result">
      <h1>Match Completed!</h1>
      <h2>{isUserWinner ? "You won the match!" : "You lost the match!"}</h2>

      <div className="innings-summary">
        <div className="innings">
          <h3>First Innings</h3>
          <p>
            {isUserBattingFirst ? "You" : "Opponent"}:{" "}
            {firstInnings.score}/{firstInnings.wickets}
          </p>
        </div>

        <div className="innings">
          <h3>Second Innings</h3>
          <p>
            {isUserBattingFirst ? "Opponent" : "You"}:{" "}
            {secondInnings.score}/{secondInnings.wickets}
          </p>
          <p>Target: {secondInnings.target}</p>
        </div>
      </div>

      <button className="restart-button" onClick={onRestart}>
        Play Again
      </button>

      <button className="home-button" onClick={goHome}>
        Go Home
      </button>
    </div>
  );
};

export default MatchResult;
