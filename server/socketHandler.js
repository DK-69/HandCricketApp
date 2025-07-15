// socketHandler.js
import { Server } from "socket.io";

const rooms = new Map();
import dotenv from 'dotenv';

const generateMatchId = () => {
  return `match_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
};

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  console.log("🔌 Socket.IO initialized");

  setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
      if (now - room.lastActivity > 30 * 60 * 1000) {
        console.log(`🧹 Cleaning inactive room ${code}`);
        rooms.delete(code);
      }
    }
  }, 10000);

  io.on("connection", (socket) => {
    console.log(`⚡ Connected: ${socket.id}`);

    socket.on("join-room", ({ roomCode, userId, playerCount }) => {
      const code = roomCode.trim().toUpperCase();
      let room = rooms.get(code);

      if (!room) {
        room = {
          players: [],
          sockets: [],
          playerCount,
          creator: userId,
          tossChoice: null,
          tossResult: null,
          winner: null,
          batBowlChoice: null,
          lastActivity: Date.now(),
        };
        rooms.set(code, room);
      }

      if (room.players.includes(userId)) {
        const index = room.players.indexOf(userId);
        room.sockets[index] = socket.id;
        socket.join(code);
        return;
      }

      if (room.players.length >= 2) {
        socket.emit("room-full");
        return;
      }

      room.players.push(userId);
      room.sockets.push(socket.id);
      room.lastActivity = Date.now();
      socket.join(code);

      if (room.players.length === 2) {
        io.to(code).emit("players-ready", {
          players: room.players,
          roomCode: code,
          playerCount: room.playerCount,
          creatorId: room.creator,
        });
      }
    });

    socket.on("toss-choice", ({ roomCode, choice }) => {
      const room = rooms.get(roomCode);
      if (!room) return;
      room.tossChoice = choice;
      room.lastActivity = Date.now();
      io.to(roomCode).emit("toss-choice-update", { choice });
    });

    socket.on("toss-result", ({ roomCode, result, winner, tossChoice }) => {
      const room = rooms.get(roomCode);
      if (!room) return;
      room.tossResult = { result, winner, tossChoice };
      room.winner = winner;
      room.lastActivity = Date.now();
      io.to(roomCode).emit("toss-result-update", { result, winner, tossChoice });
    });

    socket.on("bat-bowl-choice", ({ roomCode, choice, chooserId }) => {
      const room = rooms.get(roomCode);
      if (!room) return;
      room.batBowlChoice = choice;
      room.lastActivity = Date.now();
      io.to(roomCode).emit("bat-bowl-choice-update", { choice });

      const battingFirstId = choice === "bat" ? chooserId : room.players.find(id => id !== chooserId);

      const matchData = {
        matchID: generateMatchId(),
        player1_id: room.players[0],
        player2_id: room.players[1],
        battingFirst: battingFirstId === room.players[0] ? "user" : "opponent",
        bowlingFirst: battingFirstId === room.players[0] ? "opponent" : "user",
        tossWinner: room.winner === room.players[0] ? "user" : "opponent",
        userTossChoice: room.tossChoice,
        actualTossResult: room.tossResult.result === 0 ? "heads" : "tails",
        gameMode: "pvp",
        playerCount: room.playerCount, // ✅ ADD THIS LINE
      };


      io.to(roomCode).emit("navigate-to-game", matchData);
    });

    socket.on("sync-state", ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      socket.emit("room-state", {
        players: room.players,
        tossResult: room.tossResult,
        batBowlChoice: room.batBowlChoice,
        winner: room.winner,
      });
    });

    socket.on("leave-room", (roomCode) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const index = room.sockets.indexOf(socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        room.sockets.splice(index, 1);
        if (room.players.length === 0) {
          rooms.delete(roomCode);
        } else {
          io.to(roomCode).emit("opponent-left");
        }
      }

      socket.leave(roomCode);
    });

    socket.on("disconnect", () => {
      for (const [code, room] of rooms) {
        const index = room.sockets.indexOf(socket.id);
        if (index !== -1) {
          room.players.splice(index, 1);
          room.sockets.splice(index, 1);
          if (room.players.length === 0) {
            rooms.delete(code);
          } else {
            io.to(code).emit("opponent-left");
          }
          break;
        }
      }
    });
    // Store each move per room
    const roomMoves = {};  // { roomCode: { socketId: move, ... } }
    io.on("connection", (socket) => {
      socket.on("player-move", ({ roomCode, move }) => {
        if (!roomMoves[roomCode]) {
          roomMoves[roomCode] = {};
        }

        roomMoves[roomCode][socket.id] = move;

        const players = Object.keys(roomMoves[roomCode]);

        // If both players have sent moves
        if (players.length === 2) {
          const [player1, player2] = players;
          const move1 = roomMoves[roomCode][player1];
          const move2 = roomMoves[roomCode][player2];

          // Emit moves to each player
          io.to(player1).emit("both-moves", {
            yourMove: move1,
            opponentMove: move2,
          });
          io.to(player2).emit("both-moves", {
            yourMove: move2,
            opponentMove: move1,
          });

          // Clear moves for next round
          delete roomMoves[roomCode];
        }
      });
    });




  });
};
