import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TossSelection } from "./TossSelection";
import { UserChoice } from "./UserChoice";
import styles from './Toss.module.css';
import { socket } from "../home/SocketIO";
import { AuthContext } from "../../context/AuthContext";

const normalizeRoomCode = (rawCode) => {
  return rawCode ? rawCode.trim().toUpperCase() : '';
};

export const RoomToss = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [randomToss, setRandomToss] = useState(-1);
  const [tossChoice, setTossChoice] = useState(null);
  const [isTossDone, setIsTossDone] = useState(false);
  const [winnerId, setWinnerId] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [batBowlDecision, setBatBowlDecision] = useState(null);

  const rawRoomCode = location.state?.roomCode || localStorage.getItem("roomCode");
  const roomCode = normalizeRoomCode(rawRoomCode);
  const players = location.state?.players || [];
  const isCreator = players[0] === user._id;

  useEffect(() => {
    console.log("🎮 RoomToss mounted:", roomCode);
    console.log("👥 Players:", players);
  }, []);

  useEffect(() => {
    const handlers = {
      'toss-choice-update': ({ choice }) => {
        console.log("🎲 Opponent chose:", choice);
        setOpponentChoice(choice);
      },
      'toss-result-update': ({ result, winner, tossChoice }) => {
        console.log("🏆 Toss result:", { result, winner });
        setRandomToss(result);
        setWinnerId(winner);
        setTossChoice(tossChoice);
        setIsTossDone(true);
      },
      'bat-bowl-choice-update': ({ choice }) => {
        console.log("🏏 Opponent selected:", choice);
        setBatBowlDecision(choice);
      },
      'navigate-to-game': (data) => {
        console.log("🚀 Navigating to game:", data);
        const battingFirst = data.battingFirst;
        const bowlingFirst = data.bowlingFirst;
        const matchData = {
          matchId: data.matchID,
          player1_id: data.player1_id,
          player2_id: data.player2_id,
          battingFirst,
          bowlingFirst,
          tossWinner: data.tossWinner,
          userTossChoice: data.userTossChoice,
          actualTossResult: data.actualTossResult,
          no_of_players: data.playerCount || 11,
          myRole: players[0] === user._id ? "user" : "opponent",
          gameMode: data.gameMode
        };
        navigate("/game", { state: matchData });
      },
      'opponent-left': () => {
        alert("Opponent disconnected!");
        navigate("/");
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [navigate]);

  const handleTossSelection = (choice) => {
    setTossChoice(choice);
    socket.emit('toss-choice', { roomCode, choice });

    if (isCreator) {
      const tossVal = Math.floor(Math.random() * 2);
      const actualResult = tossVal === 0 ? "heads" : "tails";
      const creatorWon = choice === actualResult;
      const winner = creatorWon ? user._id : players[1];

      setRandomToss(tossVal);
      setWinnerId(winner);
      socket.emit('toss-result', {
        roomCode,
        result: tossVal,
        winner,
        tossChoice: choice
      });
    }
  };

  const handleBatBowlChoice = (choice) => {
    setBatBowlDecision(choice);
    socket.emit('bat-bowl-choice', {
      roomCode,
      choice,
      chooserId: user._id
    });
  };

  const renderContent = () => {
    if (!isTossDone) {
      return isCreator ? (
        <TossSelection onSelect={handleTossSelection} />
      ) : (
        <p className={styles.waiting}>⏳ Waiting for host to start toss...</p>
      );
    }

    const actualResultText = randomToss === 0 ? "heads" : "tails";
    const youWonToss = winnerId === user._id;

    return (
      <div className={styles.tossResult}>
        <p className={styles.resultLine}>
          {isCreator ? `You chose: ${tossChoice}` : `Host chose: ${opponentChoice}`}
        </p>
        <p className={styles.resultLine}>Result: <b>{actualResultText}</b></p>
        <p className={youWonToss ? styles.winText : styles.loseText}>
          {youWonToss ? "✅ You won the toss!" : "❌ Opponent won the toss"}
        </p>

        {youWonToss ? (
          <UserChoice onSelect={handleBatBowlChoice} />
        ) : batBowlDecision ? (
          <p className={styles.resultLine}>Opponent chose to <b>{batBowlDecision}</b></p>
        ) : (
          <p className={styles.waiting}>Waiting for opponent's choice...</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🪙 Match Toss</h1>
      <p className={styles.roleInfo}>
        You are: <b>{isCreator ? "Host" : "Guest"}</b>
      </p>
      {renderContent()}
    </div>
  );
};

export default RoomToss;
