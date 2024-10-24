import shortId from "shortid";
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let rooms = {}; // Store rooms and their players

const roomHandler = (io, socket) => {
    const create = (payload, callback) => {
        if (payload.type === "stranger") {
            // Check for available room
            const index = Object.keys(rooms).findIndex(roomId => rooms[roomId].vacant === true);

            if (index >= 0) {
                // Join the vacant room
                const roomId = Object.keys(rooms)[index];
                rooms[roomId].players[socket.id] = {
                    option: null,
                    optionLock: false,
                    score: 0,
                };
                rooms[roomId].vacant = false; // Room is no longer vacant
                socket.join(roomId);
                io.to(roomId).emit("room:get", rooms[roomId]); // Notify users in the room
                callback(null, roomId);
            } else {
                // Create a new room
                const roomId = shortId.generate();
                rooms[roomId] = {
                    roomId,
                    players: {
                        [socket.id]: {
                            option: null,
                            optionLock: false,
                            score: 0,
                        },
                    },
                    vacant: true,
                    timeoutId: null, // To track the timeout
                };
                socket.join(roomId);
                io.to(roomId).emit("room:get", rooms[roomId]); // Notify creator

                // Start a timeout for 1 minute (60,000 ms)
                rooms[roomId].timeoutId = setTimeout(() => {
                    // If no opponent joins, mark room as unavailable
                    if (rooms[roomId].vacant === true) {
                        io.to(roomId).emit("room:unavailable", "No opponent found. Try again later.");
                        delete rooms[roomId]; // Clean up the room
                    }
                }, 60000); // 1 minute

                callback(null, roomId);
            }
        }
    };

    const joinRoom = (roomId, callback) => {
        const room = rooms[roomId];
        if (room && room.vacant === true) {
            // Join the room
            room.players[socket.id] = {
                option: null,
                optionLock: false,
                score: 0,
            };
            room.vacant = false; // Room is no longer vacant
            socket.join(roomId);
            io.to(roomId).emit("room:get", room); // Notify all users in the room

            // Clear the timeout since the game starts now
            if (room.timeoutId) {
                clearTimeout(room.timeoutId);
                room.timeoutId = null;
            }
            callback(null, roomId);
        } else {
            callback("Room is not available", null);
        }
    };

    // Event listeners
    socket.on("room:create", create);
    socket.on("room:join", joinRoom);
};

io.on("connection", (socket) => {
    roomHandler(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

