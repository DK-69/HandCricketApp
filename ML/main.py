# ML/main.py
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import certifi           # ← new import
import os, random
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

# Load and verify URI
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in environment")

# Use certifi’s bundle so Atlas SSL certs validate properly
client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
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
    elif data.level == "hard":
        predicted = predict_hard(data.battingMoves, data.bowlingMoves, data.isComputerBatting, player_doc)
    else:
        predicted = random.randint(1, 6)

    return {"move": int(predicted)}
