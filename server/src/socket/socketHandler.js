const roomManager = require("../roooms/RoomManager");

module.exports = function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create_room", ({ username }, callback) => {
      const room = roomManager.createRoom(socket.id, username);

      socket.join(room.id);

      callback({
        roomId: room.id,
        role: "host",
        participants: roomManager.getParticipants(room.id),
        videoState: room.videoState,
      });
    });

    socket.on("join_room", ({ roomId, username }, callback) => {
      const room = roomManager.joinRoom(roomId, socket.id, username);

      if (!room) {
        callback({ error: "Room not found" });
        return;
      }

      socket.join(roomId);

      const participants = roomManager.getParticipants(roomId);

      io.to(roomId).emit("user_joined", {
        participants,
      });

      callback({
        roomId,
        role: "participant",
        participants,
        videoState: room.videoState,
      });
    });

    socket.on("leave_room", ({ roomId }) => {
      roomManager.leaveRoom(roomId, socket.id);

      socket.leave(roomId);

      const participants = roomManager.getParticipants(roomId);

      io.to(roomId).emit("user_left", {
        participants,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
