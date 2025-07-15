import random
import numpy as np
from collections import defaultdict
from xgb_predictor import XGBSequencePredictor


class HardPredictor:
    def __init__(self):
        self.user_models = {}  # userId: XGBSequencePredictor
        self.fallback_model = self._create_fallback_model()
        self.model_trained_for_user = set()  # Track users whose models were already trained

    def _create_fallback_model(self):
        class FallbackModel:
            def __init__(self):
                self.max_order = 4
                self.counts = {
                    order: defaultdict(lambda: defaultdict(int))
                    for order in range(1, self.max_order + 1)
                }
                self.history = []

            def update(self, move):
                self.history.append(move)
                n = len(self.history)
                for order in range(1, self.max_order + 1):
                    if n > order:
                        context = tuple(self.history[-order-1:-1])
                        self.counts[order][context][move] += 1

            def predict(self):
                if not self.history:
                    return random.randint(1, 6)

                for order in range(self.max_order, 0, -1):
                    if len(self.history) >= order:
                        context = tuple(self.history[-order:])
                        if context in self.counts[order]:
                            moves = self.counts[order][context]
                            return max(moves, key=moves.get)

                return max(set(self.history), key=self.history.count, default=random.randint(1, 6))

        return FallbackModel()

    def predict_hard(self, batting_moves, bowling_moves, is_computer_batting, player_doc):
        user_id = player_doc.get("userId") if player_doc else "guest"
        user_moves = bowling_moves if is_computer_batting else batting_moves
        user_moves = [int(m) for m in user_moves]

        if user_id not in self.user_models:
            self.user_models[user_id] = XGBSequencePredictor(seq_length=8)

        tcn_model = self.user_models[user_id]

        historical_moves = player_doc.get("historicalMoves", []) if player_doc else []
        combined_moves = [int(m) for m in historical_moves + user_moves]

        # Update fallback history with all known moves
        for move in combined_moves:
            self.fallback_model.update(move)

        # ✅ Only train if not already trained for this user
        if user_id not in self.model_trained_for_user and len(combined_moves) >= tcn_model.min_training_samples:
            success = tcn_model.train(combined_moves)
            if success:
                self.model_trained_for_user.add(user_id)

        # Try to predict from current match
        predicted_user_move = None
        if len(user_moves) >= tcn_model.seq_length:
            predicted_user_move = tcn_model.predict_next(user_moves)

        # Try fallback to historical+current combined if needed
        if predicted_user_move is None and len(combined_moves) >= tcn_model.seq_length:
            predicted_user_move = tcn_model.predict_next(combined_moves)

        # Final fallback if nothing works
        if predicted_user_move is None:
            predicted_user_move = self.fallback_model.predict()

        # If computer is batting, return something other than predicted_user_move
        if is_computer_batting:
            options = [i for i in range(1, 7) if i != predicted_user_move]
            return random.choice(options) if options else random.randint(1, 6)
        else:
            return predicted_user_move


# Exported function
hard_predictor = HardPredictor()

def predict_hard(batting_moves, bowling_moves, is_computer_batting, player_doc):
    return hard_predictor.predict_hard(batting_moves, bowling_moves, is_computer_batting, player_doc)
