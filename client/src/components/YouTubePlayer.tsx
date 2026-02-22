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

  useEffect(() => {

    const loadYouTubeAPI = () => {

      if (window.YT) {
        createPlayer();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      window.onYouTubeIframeAPIReady = createPlayer;

      document.body.appendChild(script);
    };

    const createPlayer = () => {

      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {

        height: "400",
        width: "700",
        videoId,

        events: {

          onReady: () => {
            console.log("Player Ready");
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

    loadYouTubeAPI();

  }, []);

  useEffect(() => {

    socket.on("play", () => {

      playerRef.current?.playVideo();

    });

    socket.on("pause", () => {

      playerRef.current?.pauseVideo();

    });

    return () => {

      socket.off("play");
      socket.off("pause");

    };

  }, []);

  return <div ref={containerRef}></div>;

}