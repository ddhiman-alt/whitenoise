import { useEffect, useCallback } from "react";

const useMediaSession = (isPlaying, onPlay, onPause) => {
    // Update media session metadata
    const updateMetadata = useCallback((activeSoundNames = []) => {
        if (!("mediaSession" in navigator)) return;

        const title = activeSoundNames.length > 0
            ? activeSoundNames.slice(0, 3).join(", ") + (activeSoundNames.length > 3 ? "..." : "")
            : "WhiteNoise";

        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: "WhiteNoise",
            album: "Ambient Sounds",
            artwork: [
                { src: "/logo192.png", sizes: "192x192", type: "image/png" },
                { src: "/logo512.png", sizes: "512x512", type: "image/png" },
            ],
        });
    }, []);

    // Set up media session action handlers
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;

        // Set action handlers
        navigator.mediaSession.setActionHandler("play", () => {
            if (onPlay) onPlay();
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            if (onPause) onPause();
        });

        navigator.mediaSession.setActionHandler("stop", () => {
            if (onPause) onPause();
        });

        // Cleanup
        return () => {
            try {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("stop", null);
            } catch (e) {
                // Ignore errors during cleanup
            }
        };
    }, [onPlay, onPause]);

    // Update playback state
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;

        navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }, [isPlaying]);

    return {
        updateMetadata,
    };
};

export default useMediaSession;
