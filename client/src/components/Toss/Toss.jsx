import { useEffect, useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TossSelection } from "./TossSelection";
import { UserChoice } from "./UserChoice";
import { ComputerDecision } from "./ComputerDecision";
import styles from './Toss.module.css';
import { checkUser } from "../../api/auth";

export const Toss = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameMode = location.state?.gameMode || 'easy'; // Default to easy if undefined
  
  const [randomToss, setRandomToss] = useState(-1);
  const [isTossDone, setIsTossDone] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [showComputerDecision, setShowComputerDecision] = useState(false);

  // Generate toss result (0 = heads, 1 = tails)
  useEffect(() => {
    setRandomToss(Math.floor(Math.random() * 2));
  }, []);

  const generateMatchId = () => {
    return `match_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  };

  // Toss reducer
  const reducer = (state, action) => {
    if (action.type === "heads") return 0;
    if (action.type === "tails") return 1;
    return state;
  };

  const [toss, dispatch] = useReducer(reducer, -1);

  // Get player ID from backend
  const findPlayerId = async () => {
    try {
      const data = await checkUser();
      return data.user._id;
    } catch (error) {
      console.log("Error getting player ID:", error);
      return null;
    }
  };

  // Computer chooses batting/bowling if it wins toss
  useEffect(() => {
    if (isTossDone && toss !== randomToss) {
      const choice = Math.floor(Math.random() * 2); // 0 = bowl, 1 = bat
      setComputerChoice(choice);
      setShowComputerDecision(true);
    }
  }, [isTossDone, toss, randomToss]);

  // Navigate to /game after all decisions are made
  useEffect(() => {
    let timer;

    const handleNavigation = async () => {
      const playersPerTeam = parseInt(localStorage.getItem('no_of_players') || 11);
      const playerId = await findPlayerId();
      
      if (!playerId) return;

      const state = {
        player1_id: playerId,
        player2_id: "Computer 430",
        userTossChoice: toss === 0 ? 'heads' : 'tails',
        actualTossResult: randomToss === 0 ? 'heads' : 'tails',
        gameMode: gameMode,
        matchId: generateMatchId(),
      };
      

      if (toss === randomToss) {
        // User won toss
        navigate('/game', {
          state: {
            ...state,
            battingFirst: userChoice === 1 ? 'user' : 'computer',
            bowlingFirst: userChoice === 1 ? 'computer' : 'user',
            tossWinner: 'user',
            no_of_players :playersPerTeam,
            myRole: 'user',

          }
        });
      } else {
        // Computer won toss
        timer = setTimeout(() => {
          navigate('/game', {
            state: {
              ...state,
              battingFirst: computerChoice === 1 ? 'computer' : 'user',
              bowlingFirst: computerChoice === 1 ? 'user' : 'computer',
              tossWinner: 'computer',
              no_of_players :playersPerTeam,
              myRole: 'user',
            }
          });
        }, 2000);
      }
    };

    if ((toss === randomToss && userChoice !== null) || 
        (toss !== randomToss && computerChoice !== null)) {
      handleNavigation();
    }

    return () => clearTimeout(timer);
  }, [userChoice, computerChoice, toss, randomToss, navigate, gameMode]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Match Toss</h1>

      {!isTossDone ? (
        <TossSelection onSelect={(choice) => {
          dispatch({ type: choice });
          setIsTossDone(true);
        }} />
      ) : toss === randomToss ? (
        <UserChoice onSelect={setUserChoice} />
      ) : (
        <ComputerDecision choice={computerChoice} />
      )}
    </div>
  );
};