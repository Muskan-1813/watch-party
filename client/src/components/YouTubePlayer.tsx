import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Props {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: Props) {

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
        videoId: videoId,
        playerVars: {
          autoplay: 0
        },
        events: {
          onReady: () => {
            console.log("YouTube Player Ready");
          }
        }
      });

    };

    loadYouTubeAPI();

  }, [videoId]);

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );

}