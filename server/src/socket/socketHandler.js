const roomManager = require("../roooms/RoomManager");

module.exports = function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // CREATE ROOM
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

    // JOIN ROOM
    socket.on("join_room", ({ roomId, username }, callback) => {
      const room = roomManager.joinRoom(roomId, socket.id, username);

      if (!room) {
        callback({ error: "Room not found" });
        return;
      }

      socket.join(roomId);

      const participants = roomManager.getParticipants(roomId);

      io.to(roomId).emit("user_joined", { participants });

      callback({
        roomId,
        role: "participant",
        participants,
        videoState: room.videoState,
      });
    });

    // LEAVE ROOM
    socket.on("leave_room", ({ roomId }) => {
      roomManager.leaveRoom(roomId, socket.id);

      socket.leave(roomId);

      const participants = roomManager.getParticipants(roomId);

      io.to(roomId).emit("user_left", { participants });
    });

    // PLAY EVENT
    socket.on("play", ({ roomId }) => {
      const room = roomManager.getRoom(roomId);
      if (!room) return;

      if (!roomManager.isHost(roomId, socket.id)) return;

      room.videoState.isPlaying = true;

      socket.to(roomId).emit("play");
    });

    // PAUSE EVENT
    socket.on("pause", ({ roomId }) => {
      const room = roomManager.getRoom(roomId);
      if (!room) return;

      if (!roomManager.isHost(roomId, socket.id)) return;

      room.videoState.isPlaying = false;

      socket.to(roomId).emit("pause");
    });

    // SEEK EVENT
    socket.on("seek", ({ roomId, time }) => {
      const room = roomManager.getRoom(roomId);
      if (!room) return;

      if (!roomManager.isHost(roomId, socket.id)) return;

      room.videoState.currentTime = time;

      socket.to(roomId).emit("seek", { time });
    });

    // CHANGE VIDEO EVENT
    socket.on("change_video", ({ roomId, videoId }) => {
      const room = roomManager.getRoom(roomId);
      if (!room) return;

      if (!roomManager.isHost(roomId, socket.id)) return;

      room.videoState.videoId = videoId;
      room.videoState.currentTime = 0;
      room.videoState.isPlaying = false;

      io.to(roomId).emit("change_video", { videoId });
    });

    // ASSIGN ROLE
    socket.on("assign_role", ({ roomId, targetSocketId, role }) => {
      if (!roomManager.isHost(roomId, socket.id)) return;

      roomManager.assignRole(roomId, targetSocketId, role);

      const participants = roomManager.getParticipants(roomId);

      io.to(roomId).emit("role_updated", {
        participants,
      });
    });

    // REMOVE PARTICIPANT
    socket.on("remove_participant", ({ roomId, targetSocketId }) => {
      if (!roomManager.isHost(roomId, socket.id)) return;

      roomManager.removeParticipant(roomId, targetSocketId);

      io.to(targetSocketId).emit("removed");

      const participants = roomManager.getParticipants(roomId);

      io.to(roomId).emit("participant_removed", {
        participants,
      });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  };);
};
