import random
from collections import defaultdict, deque

class EnhancedMarkov:
    def __init__(self, max_order=5):
        self.max_order = max_order
        self.counts = {
            order: defaultdict(lambda: defaultdict(int))
            for order in range(1, max_order + 1)
        }
        self.history = deque(maxlen=100)
        self.patterns = {
            "repetition": (2, self._repetition),
            "sequence": (3, self._sequence),
            "alternation": (4, self._alternation),
            "cycle": (4, self._cycle),
            "block_repeat": (6, self._block_repeat),
            "mirror": (6, self._mirror),
            "palindrome": (5, self._palindrome),
            "spike": (3, self._spike),
            "sandwich": (3, self._sandwich),
            "fade": (4, self._fade),
        }

    def update(self, move: int):
        self.history.append(move)
        hist = list(self.history)
        for order in range(1, self.max_order + 1):
            if len(hist) > order:
                context = tuple(hist[-order - 1:-1])
                self.counts[order][context][move] += 1

    def predict(self) -> int:
        if not self.history:
            return random.randint(1, 6)

        for name, (min_len, detector) in self.patterns.items():
            if len(self.history) >= min_len:
                context = tuple(self.history)[-min_len:]
                result = detector(context)
                if result:
                    return max(1, min(6, result))

        for order in range(self.max_order, 0, -1):
            if len(self.history) >= order:
                context = tuple(self.history)[-order:]
                if context in self.counts[order]:
                    moves = self.counts[order][context]
                    return max(moves, key=moves.get)

        return max(set(self.history), key=self.history.count, default=random.randint(1, 6))

    # --- Pattern detectors below ---

    def _repetition(self, ctx): return ctx[-1] if all(x == ctx[0] for x in ctx) else None

    def _sequence(self, ctx):
        diffs = [ctx[i+1] - ctx[i] for i in range(len(ctx)-1)]
        if all(d == diffs[0] for d in diffs): return ctx[-1] + diffs[0]
        return None

    def _alternation(self, ctx): return ctx[0] if ctx[::2] == ctx[1::2][::-1] else None

    def _cycle(self, ctx):
        size = len(ctx) // 2
        if size >= 2 and ctx[:size] == ctx[size:]: return ctx[0]
        return None

    def _block_repeat(self, ctx):
        if len(ctx) % 2 == 0:
            half = len(ctx) // 2
            return ctx[0] if ctx[:half] == ctx[half:] else None
        return None

    def _mirror(self, ctx):
        half = len(ctx) // 2
        return ctx[half] if ctx[:half] == ctx[-1:half-1:-1] else None

    def _palindrome(self, ctx): return ctx[len(ctx)//2] if ctx == ctx[::-1] else None

    def _spike(self, ctx):
        if len(ctx) != 3: return None
        a, b, c = ctx
        if a < b > c or a > b < c: return a
        return None

    def _sandwich(self, ctx): return ctx[0] if len(ctx) == 3 and ctx[0] == ctx[2] else None

    def _fade(self, ctx):
        inc = all(ctx[i] < ctx[i+1] for i in range(len(ctx)-2)) and ctx[-2] == ctx[-1]
        dec = all(ctx[i] > ctx[i+1] for i in range(len(ctx)-2)) and ctx[-2] == ctx[-1]
        return ctx[-1] if inc or dec else None

# ---------------------- FINAL HARD-LEVEL FUNCTION ----------------------

def predict_hard(batting_moves, bowling_moves, isComputerBatting, player_doc):
    predictor = EnhancedMarkov()

    # Combine historical + current relevant user moves
    user_moves = []
    if player_doc:
        past = player_doc.get("prevBowlingMoves", []) if isComputerBatting else player_doc.get("prevBattingMoves", [])
        user_moves = past + (bowling_moves if isComputerBatting else batting_moves)
    else:
        user_moves = bowling_moves if isComputerBatting else batting_moves

    for move in map(int, user_moves):
        predictor.update(move)

    predicted_user_move = predictor.predict()

    if isComputerBatting:
        # AI is batting → avoid user’s likely bowling move
        options = [i for i in range(1, 7) if i != predicted_user_move]
        return random.choice(options) if options else random.randint(1, 6)
    else:
        # AI is bowling → try to get user out
        return predicted_user_move