from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import os
from dotenv import load_dotenv
load_dotenv()

from medium_model import predict_medium
from hard_model import predict_hard

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global player_doc to simulate database
player_doc = None

# Pydantic models
class MoveHistory(BaseModel):
    battingMoves: list
    bowlingMoves: list

class MoveInput(BaseModel):
    level: str
    userId: str
    isComputerBatting: bool
    battingMoves: list
    bowlingMoves: list

# Endpoint to receive and store hard-level data
@app.post("/store-hard-data")
def store_hard_data(data: MoveHistory):
    global player_doc
    player_doc = {
        "userId": "guest",
        "prevBattingMoves": data.battingMoves,
        "prevBowlingMoves": data.bowlingMoves,
    }
    print("🧠 Stored hard data in player_doc", player_doc)
    return {"message": "Hard level data received"}

# Prediction endpoint
@app.post("/predict")
def predict(data: MoveInput):
    print(f"📩 Predict request | Level: {data.level}, User: {data.userId}")

    if data.level == "medium":
        # Medium level prediction using EnhancedMarkov
        predicted = predict_medium(data.battingMoves, data.bowlingMoves, data.isComputerBatting)

    elif data.level == "hard":
        # Hard level prediction using EnhancedMarkov + player history
        if player_doc:
            # Prepare historical moves based on current role
            historical_moves = (
                player_doc.get("prevBowlingMoves", []) if data.isComputerBatting 
                else player_doc.get("prevBattingMoves", [])
            )
            combined = historical_moves + (
                data.bowlingMoves if data.isComputerBatting else data.battingMoves
            )
            enhanced_doc = {
                "userId": "guest",
                "historicalMoves": combined
            }
        else:
            enhanced_doc = None

        # Predict using hard-level model
        predicted = predict_hard(
            data.battingMoves,
            data.bowlingMoves,
            data.isComputerBatting,
            enhanced_doc
        )

    else:
        # Random prediction for other levels
        predicted = random.randint(1, 6)

    return {"move": int(predicted)}