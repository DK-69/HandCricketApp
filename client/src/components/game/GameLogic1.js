// Fixed game logic
import { getPredictedMove } from "../../api/auth.jsx";

export const gameLogic = async(num, gameState, matchState) => {
  // Create deep copies of state
  const newMatchState = JSON.parse(JSON.stringify(matchState));
  const newGameState = { ...gameState };
  
  const isFirstInnings = newMatchState.currentInnings === 'first';
  const currentInnings = isFirstInnings ? newMatchState.firstInnings : newMatchState.secondInnings;
  
  // Correctly determine if user is batting
  const isUserBatting = 
    (isFirstInnings && newMatchState.battingFirst === 'user') ||
    (!isFirstInnings && newMatchState.battingFirst === 'computer');
  const isComputerBatting = !isUserBatting;
  // Generate computer's choice
  // const computerChoice = Math.floor(Math.random() * 6) + 1;
  let computerChoice = 4;
  if(matchState.mode=="easy"){
    // Generate computer's choice
     computerChoice = Math.floor(Math.random() * 6) + 1;
  } else{
  const response = await getPredictedMove(
    matchState.firstInnings.battingMoves,
    matchState.firstInnings.bowlingMoves,
    matchState.player1_id,
    matchState.mode,
    isComputerBatting
  );
  computerChoice = response;
}
  newGameState.userChoice = num;
  newGameState.computerChoice = computerChoice;


  if (isUserBatting) {
    // User is batting
    currentInnings.battingMoves.push(num);         // user input
    currentInnings.bowlingMoves.push(computerChoice); // computer response

    if (computerChoice === num) {
      // Wicket
      currentInnings.wickets += 1;
      if (currentInnings.wickets >= currentInnings.maxWickets) {
        currentInnings.completed = true;
        if (isFirstInnings) {
          // Move to second innings
          newMatchState.secondInnings.target = currentInnings.score + 1;
          newMatchState.currentInnings = 'second';
          newGameState.userChoice = 0;
          newGameState.computerChoice = 0;
        } else {
          // Match completed - defending team wins
          newMatchState.matchCompleted = true;
          newMatchState.winner = newMatchState.battingFirst;
        }
      }
      } else {
        // Add runs
        
        currentInnings.score += num;
        if (!isFirstInnings && currentInnings.score >= currentInnings.target) {
          currentInnings.completed = true;
          newMatchState.matchCompleted = true;
          // FIX: Set winner to chasing team
          newMatchState.winner = newMatchState.battingFirst === 'user' 
            ? 'computer' 
            : 'user';
        }
      }
  } else {
    // Computer is batting
    currentInnings.battingMoves.push(computerChoice); // computer input
    currentInnings.bowlingMoves.push(num);            // user response

    if (computerChoice === num) {
      // Wicket
      currentInnings.wickets += 1;
      if (currentInnings.wickets >= currentInnings.maxWickets) {
        currentInnings.completed = true;
        if (isFirstInnings) {
          // Move to second innings
          newMatchState.secondInnings.target = currentInnings.score + 1;
          newMatchState.currentInnings = 'second';
          newGameState.userChoice = 0;
          newGameState.computerChoice = 0;
        } else {
          // Match completed - defending team wins
          newMatchState.matchCompleted = true;
          newMatchState.winner = newMatchState.battingFirst;
        }
      }
    } else {
      // Add runs
      currentInnings.score += computerChoice;
      if (!isFirstInnings && currentInnings.score >= currentInnings.target) {
        currentInnings.completed = true;
        newMatchState.matchCompleted = true;
        // FIX: Set winner to chasing team
        newMatchState.winner = newMatchState.battingFirst === 'user' 
          ? 'computer' 
          : 'user';
      }
    }
  }
  
  return { newGameState, newMatchState };
};