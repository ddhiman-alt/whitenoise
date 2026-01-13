import { useEffect, useRef, useCallback, useState } from "react";

const useAudio = (sounds, volumes) => {
    const audioRefs = useRef({});
    const audioContextRef = useRef(null);
    const isInitialized = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const previousVolumesRef = useRef({});

    // Create or resume AudioContext (needed for background playback on mobile)
    const ensureAudioContext = useCallback(() => {
        try {
            if (
                !audioContextRef.current ||
                audioContextRef.current.state === "closed"
            ) {
                audioContextRef.current = new (
                    window.AudioContext || window.webkitAudioContext
                )();
            }
            if (audioContextRef.current.state === "suspended") {
                audioContextRef.current.resume().catch(() => {
                    // Ignore resume errors
                });
            }
            return audioContextRef.current;
        } catch (err) {
            console.log("AudioContext error:", err.message);
            return null;
        }
    }, []);

    // Initialize audio elements once
    const initializeAudio = useCallback(() => {
        if (isInitialized.current) return;

        sounds.forEach((sound) => {
            if (!audioRefs.current[sound.id]) {
                const audio = new Audio(sound.audioSrc);
                audio.loop = true;
                audio.preload = "auto";
                audio.volume = 0;
                // Enable background playback on iOS
                audio.setAttribute("playsinline", "");
                audio.setAttribute("webkit-playsinline", "");
                audioRefs.current[sound.id] = audio;

                // Add error handling
                audio.addEventListener("error", (e) => {
                    console.error(`Error loading ${sound.name}:`, e);
                });

                audio.addEventListener("canplaythrough", () => {
                    console.log(`${sound.name} ready to play`);
                });
            }
        });

        isInitialized.current = true;
    }, [sounds]);

    // Initialize on mount
    useEffect(() => {
        initializeAudio();

        // Handle visibility change for background playback
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // Resume audio context when page becomes visible
                ensureAudioContext();

                // Re-sync all playing audio
                sounds.forEach((sound) => {
                    const audio = audioRefs.current[sound.id];
                    const volume = volumes[sound.id] || 0;

                    if (audio && volume > 0 && audio.paused) {
                        audio.play().catch((err) => {
                            console.log(
                                `Audio resume failed for ${sound.name}:`,
                                err.message,
                            );
                        });
                    }
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Cleanup on unmount
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            Object.values(audioRefs.current).forEach((audio) => {
                audio.pause();
                audio.src = "";
            });
            audioRefs.current = {};
            isInitialized.current = false;
            // Don't close AudioContext - it causes errors on re-render in dev mode
            // The browser will garbage collect it when no longer referenced
        };
    }, [initializeAudio, ensureAudioContext, sounds, volumes]);

    // Update volume and play/pause based on volume changes
    useEffect(() => {
        let anyPlaying = false;

        sounds.forEach((sound) => {
            const audio = audioRefs.current[sound.id];
            const volume = volumes[sound.id] || 0;

            if (audio) {
                audio.volume = volume / 100; // Convert 0-100 to 0-1

                if (volume > 0) {
                    anyPlaying = true;
                    if (audio.paused) {
                        ensureAudioContext();
                        const playPromise = audio.play();
                        if (playPromise !== undefined) {
                            playPromise.catch((err) => {
                                console.log(
                                    `Audio play failed for ${sound.name}:`,
                                    err.message,
                                );
                            });
                        }
                    }
                } else {
                    if (!audio.paused) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }
            }
        });

        setIsPlaying(anyPlaying);
        previousVolumesRef.current = { ...volumes };
    }, [volumes, sounds, ensureAudioContext]);

    // Pause all sounds
    const pauseAll = useCallback(() => {
        sounds.forEach((sound) => {
            const audio = audioRefs.current[sound.id];
            if (audio && !audio.paused) {
                audio.pause();
            }
        });
        setIsPlaying(false);
    }, [sounds]);

    // Resume all sounds that had volume > 0
    const resumeAll = useCallback(() => {
        ensureAudioContext();
        sounds.forEach((sound) => {
            const audio = audioRefs.current[sound.id];
            const volume = volumes[sound.id] || 0;

            if (audio && volume > 0 && audio.paused) {
                audio.play().catch((err) => {
                    console.log(
                        `Audio resume failed for ${sound.name}:`,
                        err.message,
                    );
                });
            }
        });
        setIsPlaying(Object.values(volumes).some((v) => v > 0));
    }, [sounds, volumes, ensureAudioContext]);

    // Get list of currently active sound names
    const getActiveSoundNames = useCallback(() => {
        return sounds
            .filter((sound) => (volumes[sound.id] || 0) > 0)
            .map((sound) => sound.name);
    }, [sounds, volumes]);

    return {
        audioRefs,
        isPlaying,
        pauseAll,
        resumeAll,
        getActiveSoundNames,
    };
};

export default useAudio;
