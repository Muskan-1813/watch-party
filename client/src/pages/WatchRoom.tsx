import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../socket/socket";

interface Participant {
  socketId: string;
  username: string;
  role: string;
}

export default function WatchRoom() {

  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();

  const { role, participants: initialParticipants, username } = location.state as {
    role: string;
    participants: Participant[];
    videoState: any;
    username: string;
  };

  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

  useEffect(() => {

    socket.on("user_joined", (data: { participants: Participant[] }) => {
      setParticipants(data.participants);
    });

    socket.on("user_left", (data: { participants: Participant[] }) => {
      setParticipants(data.participants);
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
    };

  }, []);

  return (
    <div style={{ padding: 20 }}>

      <h2>Room ID: {roomId}</h2>
      <h3>Your Role: {role}</h3>

      <h4>Participants:</h4>

      <ul>
        {participants.map((p) => (
          <li key={p.socketId}>
            {p.username} ({p.role})
          </li>
        ))}
      </ul>

      <hr />

      <div>
        <h3>YouTube Player Coming Next...</h3>
      </div>

    </div>
  );
}