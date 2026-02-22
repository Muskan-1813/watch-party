"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const Room_1 = require("./classes/Room");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // In production, limit to your frontend URL
        methods: ['GET', 'POST'],
    },
});
const rooms = new Map();
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_room', ({ roomId, username }) => {
        if (!roomId || !username)
            return;
        let room = rooms.get(roomId);
        if (!room) {
            room = new Room_1.Room(roomId);
            rooms.set(roomId, room);
        }
        const participant = room.addParticipant(socket.id, username);
        socket.join(roomId);
        console.log(`User ${username} joined room ${roomId} as ${participant.role}`);
        // Notify others
        io.to(roomId).emit('user_joined', {
            username,
            userId: socket.id,
            role: participant.role,
            participants: room.getState().participants,
        });
        // Send current state to the new participant
        socket.emit('sync_state', room.getState());
    });
    socket.on('play', ({ roomId, currentTime }) => {
        const room = rooms.get(roomId);
        if (room && room.canControl(socket.id)) {
            room.sync(true, currentTime);
            socket.to(roomId).emit('play', { currentTime });
            console.log(`Room ${roomId}: Play at ${currentTime}`);
        }
    });
    socket.on('pause', ({ roomId, currentTime }) => {
        const room = rooms.get(roomId);
        if (room && room.canControl(socket.id)) {
            room.sync(false, currentTime);
            socket.to(roomId).emit('pause', { currentTime });
            console.log(`Room ${roomId}: Pause at ${currentTime}`);
        }
    });
    socket.on('seek', ({ roomId, currentTime }) => {
        const room = rooms.get(roomId);
        if (room && room.canControl(socket.id)) {
            room.sync(room.getState().playing, currentTime);
            socket.to(roomId).emit('seek', { currentTime });
            console.log(`Room ${roomId}: Seek to ${currentTime}`);
        }
    });
    socket.on('change_video', ({ roomId, videoId }) => {
        const room = rooms.get(roomId);
        if (room && room.canControl(socket.id)) {
            room.setVideo(videoId);
            io.to(roomId).emit('change_video', { videoId });
            console.log(`Room ${roomId}: Video changed to ${videoId}`);
        }
    });
    socket.on('assign_role', ({ roomId, userId, role }) => {
        const room = rooms.get(roomId);
        if (room && room.isHost(socket.id)) {
            room.assignRole(userId, role);
            io.to(roomId).emit('role_assigned', {
                userId,
                role,
                participants: room.getState().participants,
            });
            console.log(`Room ${roomId}: Role ${role} assigned to ${userId}`);
        }
    });
    socket.on('remove_participant', ({ roomId, userId }) => {
        const room = rooms.get(roomId);
        if (room && room.isHost(socket.id)) {
            room.removeParticipant(userId);
            io.to(roomId).emit('participant_removed', {
                userId,
                participants: room.getState().participants,
            });
            console.log(`Room ${roomId}: Participant ${userId} removed`);
            // Force disconnect the user if they're still connected
            const targetSocket = io.sockets.sockets.get(userId);
            if (targetSocket) {
                targetSocket.leave(roomId);
                targetSocket.emit('error', 'You have been removed from the room');
            }
        }
    });
    socket.on('disconnecting', () => {
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id) {
                const room = rooms.get(roomId);
                if (room) {
                    room.removeParticipant(socket.id);
                    io.to(roomId).emit('user_left', {
                        userId: socket.id,
                        participants: room.getState().participants,
                    });
                    if (room.getState().participants.length === 0) {
                        rooms.delete(roomId);
                        console.log(`Room ${roomId} deleted (empty)`);
                    }
                }
            }
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
