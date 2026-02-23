import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { Player } from "./Player";
import { ParticipantList } from "./ParticipantList";
import { LandingPage } from "./LandingPage";
import type { RoomState, Role } from "../types";
import { Share2, Video, Send, AlertCircle } from "lucide-react";
import "./WatchRoom.css";

const SOCKET_URL = 'https://watch-party-backend-97x3.onrender.com';
// const SOCKET_URL = "http://localhost:3001";

export const WatchRoom = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [_username, setUsername] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleJoin = (roomId: string, name: string) => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    setUsername(name);

    newSocket.emit("join_room", { roomId, username: name });

    newSocket.on("sync_state", (state: RoomState) => {
      setRoomState(state);
      setJoined(true);
      setError(null);
    });

    newSocket.on("play", ({ currentTime }) => {
      setRoomState((prev) =>
        prev ? { ...prev, playing: true, currentTime } : null,
      );
    });

    newSocket.on("pause", ({ currentTime }) => {
      setRoomState((prev) =>
        prev ? { ...prev, playing: false, currentTime } : null,
      );
    });

    newSocket.on("seek", ({ currentTime }) => {
      setRoomState((prev) => (prev ? { ...prev, currentTime } : null));
    });

    newSocket.on("user_joined", ({ participants }) => {
      setRoomState((prev) => (prev ? { ...prev, participants } : null));
    });

    newSocket.on("user_left", ({ participants }) => {
      setRoomState((prev) => (prev ? { ...prev, participants } : null));
    });

    newSocket.on("change_video", ({ videoId }) => {
      setRoomState((prev) =>
        prev ? { ...prev, videoId, currentTime: 0, playing: false } : null,
      );
    });

    newSocket.on("role_assigned", ({ participants }) => {
      setRoomState((prev) => (prev ? { ...prev, participants } : null));
    });

    newSocket.on("participant_removed", ({ userId, participants }) => {
      if (newSocket.id === userId) {
        setJoined(false);
        setError("You have been removed from the room");
        newSocket.disconnect();
      } else {
        setRoomState((prev) => (prev ? { ...prev, participants } : null));
      }
    });

    newSocket.on("error", (msg: string) => {
      setError(msg);
    });
  };

  const handleStateChange = (playing: boolean, time: number) => {
    if (!socket || !roomState) return;
    if (playing) {
      socket.emit("play", { roomId: roomState.roomId, currentTime: time });
    } else {
      socket.emit("pause", { roomId: roomState.roomId, currentTime: time });
    }
  };

  const handleSeek = (time: number) => {
    if (!socket || !roomState) return;
    socket.emit("seek", { roomId: roomState.roomId, currentTime: time });
  };

  const handleChangeVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !roomState) return;

    // Extract video ID from URL
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (videoId) {
      socket.emit("change_video", { roomId: roomState.roomId, videoId });
      setVideoUrl("");
    } else {
      setError("Invalid YouTube URL");
    }
  };

  const handleAssignRole = (userId: string, role: Role) => {
    if (!socket || !roomState) return;
    socket.emit("assign_role", { roomId: roomState.roomId, userId, role });
  };

  const handleRemoveParticipant = (userId: string) => {
    if (!socket || !roomState) return;
    socket.emit("remove_participant", { roomId: roomState.roomId, userId });
  };

  const copyRoomLink = () => {
    if (roomState) {
      navigator.clipboard.writeText(roomState.roomId);
      // Optional: show a toast
    }
  };

  if (!joined) {
    return (
      <>
        {error && (
          <div
            className="glass"
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 24px",
              color: "var(--danger-color)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 100,
            }}
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        <LandingPage onJoin={handleJoin} />
      </>
    );
  }

  const currentUser = roomState?.participants.find(
    (p) => p.userId === socket?.id,
  );
  const canControl =
    currentUser?.role === "host" || currentUser?.role === "moderator";
  const isHost = currentUser?.role === "host";

  return (
    <div
      className="container"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "20px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "var(--primary-color)",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <Video color="white" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700" }}>
              {roomState?.roomId}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Live Watch Party
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-secondary" onClick={copyRoomLink}>
            <Share2 size={18} />
            Copy Code
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "20px",
          minHeight: 0,
        }}
        className="watch-grid"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            className="glass"
            style={{
              flex: 1,
              minHeight: 0,
              position: "relative",
              aspectRatio: "16 / 9",
              maxHeight: "70vh",
            }}
          >
            {roomState && (
              <Player
                videoId={roomState.videoId}
                playing={roomState.playing}
                currentTime={roomState.currentTime}
                canControl={canControl}
                onStateChange={handleStateChange}
                onSeek={handleSeek}
              />
            )}
          </div>

          {canControl && (
            <form
              onSubmit={handleChangeVideo}
              className="glass"
              style={{ padding: "16px", display: "flex", gap: "12px" }}
            >
              <input
                className="input"
                placeholder="Paste YouTube video URL..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                <Send size={18} />
                Change Video
              </button>
            </form>
          )}
        </div>

        <aside
          style={{
            height: "100%",
            maxHeight: "40vh",
          }}
          className="participants-panel"
        >
          {roomState && (
            <ParticipantList
              participants={roomState.participants}
              currentUserId={socket?.id || null}
              isHost={isHost}
              onAssignRole={handleAssignRole}
              onRemove={handleRemoveParticipant}
            />
          )}
        </aside>
      </main>
    </div>
  );
};
