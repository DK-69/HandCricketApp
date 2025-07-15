import numpy as np
import xgboost as xgb
from sklearn.utils import shuffle
# from sklearn.utils.class_weight import compute_sample_weight


class XGBSequencePredictor:
    def __init__(self, seq_length=8):
        self.seq_length = seq_length
        self.model = None
        self.trained = False
        self.min_training_samples = 30

    def preprocess_data(self, sequence):
        sequence = [min(6, max(1, int(m))) for m in sequence]
        X, y = [], []
        for i in range(len(sequence) - self.seq_length):
            X.append(sequence[i:i + self.seq_length])
            y.append(sequence[i + self.seq_length])
        if not X:
            return None, None
        X = np.array(X, dtype=np.float32)
        y = np.array(y) - 1  # Labels 0-based for XGBoost
        return X, y

    def train(self, sequence):
        X, y = self.preprocess_data(sequence)
        if X is None or len(X) < self.min_training_samples:
            return False

        X, y = shuffle(X, y)

        self.model = xgb.XGBClassifier(
            objective="multi:softprob",
            num_class=6,
            max_depth=4,
            learning_rate=0.1,
            n_estimators=50,
            verbosity=0
        )

        self.model.fit(X, y)
        self.trained = True
        return True

    def predict_next(self, recent_moves):
        if not self.trained or len(recent_moves) < self.seq_length:
            return None
        input_seq = [min(6, max(1, int(m))) for m in recent_moves[-self.seq_length:]]
        input_array = np.array(input_seq, dtype=np.float32).reshape(1, -1)
        probabilities = self.model.predict_proba(input_array)[0]
        return np.argmax(probabilities) + 1  # Back to 1–6
