import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Props {
  videoId: string;
  roomId: string;
  role: string;
}

export default function YouTubePlayer({ videoId, roomId, role }: Props) {

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoIdRef = useRef<string>("");

  // Load API once
  useEffect(() => {

    const createPlayer = () => {

      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {

        height: "400",
        width: "700",
        videoId,

        events: {

          onReady: () => {
            currentVideoIdRef.current = videoId;
          },

          onStateChange: (event: any) => {

            if (role !== "host") return;

            if (event.data === window.YT.PlayerState.PLAYING) {

              socket.emit("play", { roomId });

            }

            if (event.data === window.YT.PlayerState.PAUSED) {

              socket.emit("pause", { roomId });

            }

          }

        }

      });

    };

    if (!window.YT) {

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = createPlayer;

      document.body.appendChild(script);

    } else {

      createPlayer();

    }

  }, []);



  // Handle video change safely
  useEffect(() => {

    if (!playerRef.current) return;

    if (currentVideoIdRef.current === videoId) return;

    playerRef.current.loadVideoById(videoId);

    currentVideoIdRef.current = videoId;

  }, [videoId]);



  // Receive socket events
  useEffect(() => {

    socket.on("play", () => {

      playerRef.current?.playVideo();

    });

    socket.on("pause", () => {

      playerRef.current?.pauseVideo();

    });

    socket.on("seek", ({ time }) => {

      playerRef.current?.seekTo(time, true);

    });

    socket.on("change_video", ({ videoId }) => {

      playerRef.current?.loadVideoById(videoId);

    });

    return () => {

      socket.off("play");
      socket.off("pause");
      socket.off("seek");
      socket.off("change_video");

    };

  }, []);



  // Seek sync (host only)
  useEffect(() => {

    if (role !== "host") return;

    const interval = setInterval(() => {

      if (!playerRef.current) return;

      const time = playerRef.current.getCurrentTime();

      socket.emit("seek", {
        roomId,
        time
      });

    }, 2000);

    return () => clearInterval(interval);

  }, []);



  return <div ref={containerRef}></div>;

}