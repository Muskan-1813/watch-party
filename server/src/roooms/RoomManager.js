const { v4: uuidv4 } = require("uuid");

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(hostSocketId, username) {
    const roomId = uuidv4();

    const room = {
      id: roomId,
      host: hostSocketId,
      videoState: {
        videoId: "dQw4w9WgXcQ",
        currentTime: 0,
        isPlaying: false,
      },
      participants: new Map(),
    };

    room.participants.set(hostSocketId, {
      socketId: hostSocketId,
      username,
      role: "host",
    });

    this.rooms.set(roomId, room);

    return room;
  }

  joinRoom(roomId, socketId, username) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.participants.set(socketId, {
      socketId,
      username,
      role: "participant",
    });

    return room;
  }

  leaveRoom(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.participants.delete(socketId);

    if (room.participants.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getParticipants(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.participants.values());
  }

  isHost(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    return room.host === socketId;
  }

  // 🔥 NEW METHODS BELOW

  assignRole(roomId, targetSocketId, newRole) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const participant = room.participants.get(targetSocketId);
    if (!participant) return null;

    participant.role = newRole;

    return participant;
  }

  removeParticipant(roomId, targetSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.participants.delete(targetSocketId);
  }
}

module.exports = new RoomManager();
