import { useState } from "react";
import { socket } from "../socket/socket.ts";

export default function Home() {

  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const createRoom = () => {

    if (!username) {
      alert("Enter username");
      return;
    }

    socket.connect();

    socket.emit("create_room", { username }, (response: any) => {

      console.log("Room created:", response);

      alert("Room created: " + response.roomId);

    });

  };

  const joinRoom = () => {

    if (!username || !roomId) {
      alert("Enter username and roomId");
      return;
    }

    socket.connect();

    socket.emit("join_room", { roomId, username }, (response: any) => {

      if (response.error) {
        alert(response.error);
        return;
      }

      console.log("Joined room:", response);

      alert("Joined room");

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