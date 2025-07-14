import { getPredictedMove } from "../../api/auth.jsx";
import { socket } from "../home/SocketIO.jsx";

// Utility: wait for opponent's move
const getOpponentMove = (roomCode, playerId, myMove) => {
  return new Promise((resolve) => {
    socket.emit("player-move", { roomCode, playerId, move: myMove });

    socket.once("both-moves", ({ yourMove, opponentMove }) => {
      resolve({ yourMove, opponentMove });
    });
  });
};

export const gameLogic = async (num, gameState, matchState, myRole) => {
  const newMatchState = JSON.parse(JSON.stringify(matchState));
  const newGameState = { ...gameState };

  const isFirstInnings = newMatchState.currentInnings === "first";
  const currentInnings = isFirstInnings
    ? newMatchState.firstInnings
    : newMatchState.secondInnings;

  const isPvP = matchState.mode === "pvp";

  let userMove = num;
  let opponentMove = null;

  if (isPvP) {
    const roomCode = localStorage.getItem("roomCode");
    const playerId = localStorage.getItem("userId");
    const { yourMove, opponentMove: opp } = await getOpponentMove(
      roomCode,
      playerId,
      num
    );
    userMove = yourMove;
    opponentMove = opp;
  } else {
    if (matchState.mode === "easy") {
      opponentMove = Math.floor(Math.random() * 6) + 1;
    } else {
      const isComputerBatting =
        (isFirstInnings && newMatchState.battingFirst !== myRole) ||
        (!isFirstInnings && newMatchState.battingFirst === myRole);

      const response = await getPredictedMove(
        matchState.firstInnings.battingMoves,
        matchState.firstInnings.bowlingMoves,
        matchState.player1_id,
        matchState.mode,
        isComputerBatting
      );
      opponentMove = response;
    }
  }

  newGameState.userChoice = userMove;
  newGameState.computerChoice = opponentMove;

  const isUserBatting =
    (isFirstInnings && currentInnings.battingBy === myRole) ||
    (!isFirstInnings && currentInnings.battingBy === myRole);

  if (isUserBatting) {
    currentInnings.battingMoves.push(userMove);
    currentInnings.bowlingMoves.push(opponentMove);

    if (userMove === opponentMove) {
      currentInnings.wickets += 1;
      if (currentInnings.wickets >= currentInnings.maxWickets) {
        currentInnings.completed = true;
        if (isFirstInnings) {
          newMatchState.secondInnings.target = currentInnings.score + 1;
          newMatchState.currentInnings = "second";
          newGameState.userChoice = 0;
          newGameState.computerChoice = 0;
        } else {
          newMatchState.matchCompleted = true;
          newMatchState.winner = myRole;
        }
      }
    } else {
      currentInnings.score += userMove;
      if (
        !isFirstInnings &&
        currentInnings.score >= newMatchState.secondInnings.target
      ) {
        currentInnings.completed = true;
        newMatchState.matchCompleted = true;
        newMatchState.winner = myRole;
      }
    }
  } else {
    currentInnings.battingMoves.push(opponentMove);
    currentInnings.bowlingMoves.push(userMove);

    if (userMove === opponentMove) {
      currentInnings.wickets += 1;
    } else {
      currentInnings.score += opponentMove;
    }

    if (isFirstInnings) {
      if (currentInnings.wickets >= currentInnings.maxWickets) {
        currentInnings.completed = true;
        newMatchState.secondInnings.target = currentInnings.score + 1;
        newMatchState.currentInnings = "second";
        newGameState.userChoice = 0;
        newGameState.computerChoice = 0;
      }
    } else {
      if (currentInnings.score >= newMatchState.secondInnings.target) {
        currentInnings.completed = true;
        newMatchState.matchCompleted = true;
        newMatchState.winner = isUserBatting
          ? myRole
          : myRole === "user"
          ? "opponent"
          : "user";
      } else if (currentInnings.wickets >= currentInnings.maxWickets) {
        currentInnings.completed = true;
        newMatchState.matchCompleted = true;
        newMatchState.winner = isUserBatting
          ? myRole === "user"
            ? "opponent"
            : "user"
          : myRole;
      }
    }
  }

  return { newGameState, newMatchState };
};
