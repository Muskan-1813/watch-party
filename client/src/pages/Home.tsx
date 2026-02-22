import { useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

interface CreateRoomResponse {
  roomId: string;
  role: string;
  participants: any[];
  videoState: any;
  error?: string;
}

export default function Home() {

  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const navigate = useNavigate();

  const createRoom = () => {

    if (!username) {
      alert("Enter username");
      return;
    }

    socket.connect();

    socket.emit("create_room", { username }, (response: CreateRoomResponse) => {

      if (response.error) {
        alert(response.error);
        return;
      }

      navigate(`/room/${response.roomId}`, {
        state: {
          role: response.role,
          participants: response.participants,
          videoState: response.videoState,
          username
        }
      });

    });

  };

  const joinRoom = () => {

    if (!username || !roomId) {
      alert("Enter username and roomId");
      return;
    }

    socket.connect();

    socket.emit("join_room", { roomId, username }, (response: CreateRoomResponse) => {

      if (response.error) {
        alert(response.error);
        return;
      }

      navigate(`/room/${roomId}`, {
        state: {
          role: response.role,
          participants: response.participants,
          videoState: response.videoState,
          username
        }
      });

    });

  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Watch Party</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <button onClick={createRoom}>
        Create Room
      </button>

      <br /><br />

      <input
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <br /><br />

      <button onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
}