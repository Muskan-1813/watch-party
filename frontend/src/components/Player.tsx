import { useEffect, useRef, useState } from 'react';

interface PlayerProps {
    videoId: string;
    playing: boolean;
    currentTime: number;
    canControl: boolean;
    onStateChange: (playing: boolean, time: number) => void;
    onSeek: (time: number) => void;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export const Player = ({ videoId, playing, currentTime, canControl, onStateChange, onSeek }: PlayerProps) => {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        // Load YouTube API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initPlayer();
            };
        } else {
            initPlayer();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    const initPlayer = () => {
        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId,
            playerVars: {
                autoplay: playing ? 1 : 0,
                controls: canControl ? 1 : 0,
                disablekb: canControl ? 0 : 1,
                fs: 1,
                rel: 0,
                modestbranding: 1,
            },
            events: {
                onReady: () => setIsReady(true),
                onStateChange: handleYTStateChange,
            },
        });
    };

    const handleYTStateChange = (event: any) => {
        if (!canControl) return;

        const newState = event.data;
        const time = playerRef.current.getCurrentTime();

        if (newState === window.YT.PlayerState.PLAYING) {
            onStateChange(true, time);
        } else if (newState === window.YT.PlayerState.PAUSED) {
            onStateChange(false, time);
        }
    };

    // Sync external state to player
    useEffect(() => {
        if (!isReady || !playerRef.current) return;

        // Video ID change
        if (playerRef.current.getVideoData().video_id !== videoId) {
            playerRef.current.loadVideoById(videoId);
            return;
        }

        // Play/Pause sync
        const playerPlaying = playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING;
        if (playing && !playerPlaying) {
            playerRef.current.playVideo();
        } else if (!playing && playerPlaying) {
            playerRef.current.pauseVideo();
        }

        // Seek sync - only if drift is significant (> 2s)
        const playerTime = playerRef.current.getCurrentTime();
        if (Math.abs(playerTime - currentTime) > 2) {
            playerRef.current.seekTo(currentTime, true);
        }
    }, [videoId, playing, currentTime, isReady]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            {!canControl && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        cursor: 'not-allowed'
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
    );
};
