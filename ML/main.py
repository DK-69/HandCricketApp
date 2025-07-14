from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import random
import os

from dotenv import load_dotenv
load_dotenv()

from medium_model import predict_medium
from hard_model import predict_hard

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise Exception("MONGO_URI is not set in .env file!")

client = AsyncIOMotorClient(MONGO_URI)
db = client["handCricketApp"]
players_collection = db["playerdetails"]

class MoveInput(BaseModel):
    level: str
    userId: str
    isComputerBatting: bool
    battingMoves: list
    bowlingMoves: list

@app.post("/predict")
async def predict(data: MoveInput):
    print(f"📩 Predict request | Level: {data.level}, User: {data.userId}")

    player_doc = await players_collection.find_one({"userId": data.userId})

    if data.level == "medium":
        predicted = predict_medium(data.battingMoves, data.bowlingMoves, data.isComputerBatting)
        print("🎯 Using Medium model")
    elif data.level == "hard":
        predicted = predict_hard(data.battingMoves, data.bowlingMoves, data.isComputerBatting, player_doc)
        print("🧠 Using Hard model")
    else:
        predicted = random.randint(1, 6)
        print("🔁 Using Random model")

    return {"move": int(predicted)}
