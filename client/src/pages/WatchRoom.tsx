
import YouTubePlayer from "../components/YouTubePlayer";
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
  const [videoInput, setVideoInput] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ"); 
  const changeVideo = () => {

  if (role !== "host") {
    alert("Only host can change video");
    return;
  }

  socket.emit("change_video", {
    roomId,
    videoId: videoInput
  });

  setVideoId(videoInput);
};
  useEffect(() => {
    socket.on("change_video", ({ videoId }) => {
    setVideoId(videoId);
});
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
      <br />

        <input
        placeholder="Enter YouTube Video ID"
        value={videoInput}
        onChange={(e) => setVideoInput(e.target.value)}
        />

        <button onClick={changeVideo}>
        Change Video
        </button>

        <br /><br />
            <div>
        <YouTubePlayer
            videoId={videoId}
            roomId={roomId!}
            role={role}
            />
        
      </div>

    </div>
  );
}