from collections import defaultdict, deque
import random

class EnhancedMarkov:
    def __init__(self,max_order = 3):
        self.max_order = max_order
        self.counts={
            order: defaultdict(lambda: defaultdict(int))
            for order in range(1,max_order+1)
        }
        self.history = deque(maxlen = 100)
        self.patterns={
            "repetition": (2, self._detect_repetition),
            "sequence": (3,self._detect_sequence),
            "alternation": (3,self._detect_alternation)
        }
    def update(self,move: int):
        self.history.append(move)
        history_list = list(self.history)
        for order in range(1, self.max_order+1):
            if len(history_list)> order:
                context = tuple(history_list[-order-1:-1])
                self.counts[order][context][move] +=1
    def _detect_repetition(self, context: tuple):
        # Check if all numbers in context are identical
        if len(context) < 2:  # 🚨 Add length check
            return None
        if len(set(context)) == 1:
            return context[0]  # Predict same number
        return None

    def _detect_sequence(self, context: tuple):
        # Check for incrementing/decrementing sequences
        diffs = [context[i+1] - context[i] for i in range(len(context)-1)]
        if all(d == 1 for d in diffs):
            return context[-1] + 1  # Predict next in sequence
        elif all(d == -1 for d in diffs):
            return context[-1] - 1
        return None

    def _detect_alternation(self, context: tuple):
        # Check for A-B-A-B patterns
        if len(context) < 2:  # 🚨 Add length check
            return None
        if len(context) % 2 != 0: 
            context = context[1:]  # Use even-length window
        first_half = context[::2]
        second_half = context[1::2]
        if (len(set(first_half)) == 1 and 
            len(set(second_half)) == 1 and
            first_half[0] != second_half[0]):
            return first_half[0]  # Predict first in alternation
        return None
    def predict(self) -> int:
        if not self.history:
            return random.randint(1, 6)
        # 1. First check for strong patterns
        for pattern_name, (min_length, detector) in self.patterns.items():
            if len(self.history) >= min_length:
                # Get recent moves for pattern detection
                context = tuple(self.history)[-min_length:]
                if prediction := detector(context):
                    return prediction
        
        # 2. Markov backoff (order N → N-1 → ... → 1)
        for order in range(self.max_order, 0, -1):
            if len(self.history) >= order:
                context = tuple(self.history)[-order:]
                if context in self.counts[order]:
                    # Get most frequent next move
                    moves = self.counts[order][context]
                    return max(moves, key=moves.get)
        
        # 3. Fallback to global most frequent
        return max(set(self.history), key=self.history.count)
    

def predict_medium(batting_moves, bowling_moves, isComputerBatting):
    predictor = EnhancedMarkov(max_order=3)

    # If computer is batting, it should learn from user's bowling
    history = bowling_moves if isComputerBatting else batting_moves
    int_history = [int(move) for move in history]
    for move in int_history:
        predictor.update(move)

    # Predict user's next move
    predicted_user_move = predictor.predict()

    if isComputerBatting:
        # Computer is batting → avoid playing what user is predicted to bowl
        options = [i for i in range(1, 7) if i != predicted_user_move]
        prediction = random.choice(options)
    else:
        # Computer is bowling → try to guess what user will bat
        prediction = predicted_user_move

    return max(1, min(6, prediction))



