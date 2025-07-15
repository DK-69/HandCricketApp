import { useState,useRef} from "react";
import HandSign from "./HandSign";
import ScorecardModal from "./ScorecardModal";
import { useLocation } from "react-router-dom";
import MatchResult from "./MatchResult";
// import { AuthContext } from "../../context/AuthContext";
import { gameLogic } from "./GameLogic";


const GamePage = () => {
  // const {user} = useContext(AuthContext);
  const location = useLocation();
  const tossDetails = location.state || {};
  // Get players from localStorage with fallback
  
  const maxWickets = tossDetails.no_of_players || 4;
  // Initialize match state with toss details
  const role = tossDetails.myRole || "user";
  const otherRole = role === "user" ? "opponent" : "user";

  const [matchState, setMatchState] = useState({
    matchId: tossDetails.matchId,
    mode: tossDetails.gameMode,
    player1_id: tossDetails.player1_id,
    player2_id: tossDetails.player2_id,

    tossWinner: tossDetails.tossWinner,
    battingFirst: tossDetails.battingFirst,
    bowlingFirst: tossDetails.bowlingFirst,
    playersPerTeam: tossDetails.no_of_players || 4,

    currentInnings: 'first',
    matchCompleted: false,
    winner: null,
    myRole:role, 
    firstInnings: {
      battingBy: tossDetails.battingFirst,
      score: 0,
      wickets: 0,
      maxWickets: tossDetails.no_of_players || 4,
      completed: false,
      battingMoves: [],
      bowlingMoves: [],
    },

    secondInnings: {
      battingBy: tossDetails.bowlingFirst,
      score: 0,
      wickets: 0,
      maxWickets: tossDetails.no_of_players || 4,
      target: 0,
      completed: false,
      battingMoves: [],
      bowlingMoves: [],
    },
  });
  // console.log(matchState)
  const [gameState, setGameState] = useState({
    playersRemaining: maxWickets,
    userChoice: 0,
    computerChoice: 0,
    showModal: false,
    glowSign: null,
    glowType: null
  });

  const glowTimeout = useRef(null);

  const handleClick = async(num) => {
    if (matchState.matchCompleted) return;
    if (glowTimeout.current) clearTimeout(glowTimeout.current);
    
    const { newGameState, newMatchState } = await gameLogic(
      num, 
      gameState, 
      matchState,
      role
    );
    
    setGameState({
      ...newGameState,
      userChoice: num,
      glowSign: num,
      glowType: newGameState.computerChoice === num ? 'red' : 'green'
    });
    
    setMatchState(newMatchState);
    
    glowTimeout.current = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        glowSign: null,
        glowType: null
      }));
    }, newGameState.computerChoice === num ? 1000 : 500);
  };

  const toggleModal = () => {
    setGameState(prev => ({ ...prev, showModal: !prev.showModal }));
  };

  const resetGame = () => {
    const freshMatchState = {
      matchId: tossDetails.matchId,
      mode: tossDetails.gameMode,
      player1_id: tossDetails.player1_id,
      player2_id: tossDetails.player2_id,

      tossWinner: tossDetails.tossWinner,
      battingFirst: tossDetails.battingFirst,
      bowlingFirst: tossDetails.bowlingFirst,
      playersPerTeam: tossDetails.no_of_players || 4,

      currentInnings: 'first',
      matchCompleted: false,
      winner: null,
      myRole: role,
      firstInnings: {
        battingBy: tossDetails.battingFirst,
        score: 0,
        wickets: 0,
        maxWickets: tossDetails.no_of_players || 4,
        completed: false,
        battingMoves: [],
        bowlingMoves: [],
      },

      secondInnings: {
        battingBy: tossDetails.bowlingFirst,
        score: 0,
        wickets: 0,
        maxWickets: tossDetails.no_of_players || 4,
        target: 0,
        completed: false,
        battingMoves: [],
        bowlingMoves: [],
      },
    };

    setMatchState(freshMatchState);

    setGameState({
      playersRemaining: maxWickets,
      userChoice: 0,
      computerChoice: 0,
      showModal: false,
      glowSign: null,
      glowType: null,
    });
  };




  // Helper functions with null checks
  const getCurrentInnings = () => {
    return matchState.currentInnings === 'first' 
      ? matchState.firstInnings 
      : matchState.secondInnings;
  };

  const getCurrentScore = () => getCurrentInnings().score;
  const getCurrentWickets = () => getCurrentInnings().wickets;
  const getPlayersRemaining = () => getCurrentInnings().maxWickets - getCurrentInnings().wickets;

  const getTargetDisplay = () => {
    return matchState.currentInnings === 'second'
      ? ` | Target: ${matchState.secondInnings.target}`
      : '';
  };

  return (
    <div className="game-container">
      {/* Backdrop for match result */}
      {matchState.matchCompleted && (
        <div className="result-backdrop"></div>
      )}
      
      <nav>
        <div className="navdiv">
          <div id="players_left">
            <label>Players Remaining:</label>
            <div id="players_count">
              {getPlayersRemaining()}
            </div>
          </div>
          
          <div id="score_container">
            <label>SCORE:&nbsp;</label>
            <div id="score">
              {getCurrentScore()} - {getCurrentWickets()}
              {getTargetDisplay()}
            </div>
          </div>
          
          <ul className="game-nav">
            <li><button className="nav-button" onClick={toggleModal}>SCORECARD</button></li>
            <li><button className="nav-button" onClick={resetGame}>RESTART</button></li>
            <li><a className="nav-button" href="/">EXIT</a></li>
          </ul>
        </div>
      </nav>
      {/* Main game area */}
      {!matchState.matchCompleted && (
        <div className="HandContainer">
          <div className="signs">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <HandSign 
                key={num} 
                number={num} 
                onClick={() => handleClick(num)}
                glow={gameState.glowSign === num ? gameState.glowType : null}
              />
            ))}
          </div>
          
          <div className="live_score">
            <input 
              type="text" 
              value={gameState.userChoice ?? ''} 
              readOnly 
            />
          </div>
          
          <div className="live_score">
            <input 
              type="text" 
              value={gameState.computerChoice ?? ''} 
              readOnly 
            />
          </div>
          
          <div className="csigns">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <HandSign key={`c${num}`} number={num} isComputer={true} />
            ))}
          </div>
        </div>
      )}
      {gameState.showModal && (
        <ScorecardModal 
          score={getCurrentScore()} 
          wickets={getCurrentWickets()}
          onClose={toggleModal} 
        />
      )}

      {matchState.matchCompleted && (
        <MatchResult 
          matchState = {matchState}
          onRestart={resetGame}
          myRole={role}
        />
      )}
    </div>
    
  );
};

export default GamePage;