import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import SoundsSection from "./components/SoundsSection";
import Footer from "./components/Footer";
import sounds from "./data/sounds";
import useAudio from "./hooks/useAudio";
import useTimer from "./hooks/useTimer";
import useWakeLock from "./hooks/useWakeLock";
import useMediaSession from "./hooks/useMediaSession";

const PLAYLISTS_STORAGE_KEY = "whitenoise_playlists";

function App() {
    const [volumes, setVolumes] = useState(() => {
        const initialVolumes = {};
        sounds.forEach((sound) => {
            initialVolumes[sound.id] = 0;
        });
        return initialVolumes;
    });

    const [playlists, setPlaylists] = useState(() => {
        const saved = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    // Check if any sound is active
    const hasActiveSounds = Object.values(volumes).some((v) => v > 0);

    // Reset all volumes
    const handleResetAll = useCallback(() => {
        const resetVolumes = {};
        sounds.forEach((sound) => {
            resetVolumes[sound.id] = 0;
        });
        setVolumes(resetVolumes);
    }, []);

    // Initialize timer with callback to stop all sounds
    const {
        timeRemaining,
        isTimerActive,
        startTimer,
        stopTimer,
        addTime,
        formatTime,
    } = useTimer(handleResetAll);

    // Initialize audio playback
    const { isPlaying, pauseAll, resumeAll, getActiveSoundNames } = useAudio(
        sounds,
        volumes,
    );

    // Initialize wake lock for background playback
    const {
        isWakeLockActive,
        isWakeLockSupported,
        requestWakeLock,
        releaseWakeLock,
    } = useWakeLock();

    // Initialize media session for lock screen controls
    const { updateMetadata } = useMediaSession(isPlaying, resumeAll, pauseAll);

    // Save playlists to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    }, [playlists]);

    // Update media session metadata when active sounds change
    useEffect(() => {
        if (isPlaying) {
            updateMetadata(getActiveSoundNames());
        }
    }, [isPlaying, volumes, updateMetadata, getActiveSoundNames]);

    // Manage wake lock based on playback state
    useEffect(() => {
        if (hasActiveSounds && isWakeLockSupported) {
            requestWakeLock();
        } else if (!hasActiveSounds && isWakeLockActive) {
            releaseWakeLock();
        }
    }, [
        hasActiveSounds,
        isWakeLockSupported,
        isWakeLockActive,
        requestWakeLock,
        releaseWakeLock,
    ]);

    const handleVolumeChange = (soundId, newVolume) => {
        setVolumes((prev) => ({
            ...prev,
            [soundId]: newVolume,
        }));
    };

    // Check if two volume objects have the same sounds and volumes
    const areVolumesEqual = (vol1, vol2) => {
        const keys1 = Object.keys(vol1);
        const keys2 = Object.keys(vol2);

        if (keys1.length !== keys2.length) return false;

        return keys1.every((key) => vol1[key] === vol2[key]);
    };

    const handleSavePlaylist = (name) => {
        // Check for duplicate name (case-insensitive)
        const isDuplicateName = playlists.some(
            (playlist) => playlist.name.toLowerCase() === name.toLowerCase(),
        );

        if (isDuplicateName) {
            return {
                success: false,
                error: "A playlist with this name already exists!",
            };
        }

        // Check for duplicate sound mix
        const isDuplicateMix = playlists.some((playlist) =>
            areVolumesEqual(playlist.volumes, volumes),
        );

        if (isDuplicateMix) {
            return {
                success: false,
                error: "A playlist with the same sound mix already exists!",
            };
        }

        const newPlaylist = {
            id: Date.now().toString(),
            name,
            volumes: { ...volumes },
            createdAt: new Date().toISOString(),
        };
        setPlaylists((prev) => [...prev, newPlaylist]);
        return { success: true };
    };

    const handleLoadPlaylist = (playlistId) => {
        const playlist = playlists.find((p) => p.id === playlistId);
        if (playlist) {
            // Merge with current sounds (in case new sounds were added)
            const newVolumes = {};
            sounds.forEach((sound) => {
                newVolumes[sound.id] = playlist.volumes[sound.id] || 0;
            });
            setVolumes(newVolumes);
        }
    };

    const handleDeletePlaylist = (playlistId) => {
        setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <SoundsSection
                    sounds={sounds}
                    volumes={volumes}
                    onVolumeChange={handleVolumeChange}
                    onResetAll={handleResetAll}
                    playlists={playlists}
                    onSavePlaylist={handleSavePlaylist}
                    onLoadPlaylist={handleLoadPlaylist}
                    onDeletePlaylist={handleDeletePlaylist}
                    // Timer props
                    isTimerActive={isTimerActive}
                    timeRemaining={timeRemaining}
                    formatTime={formatTime}
                    onStartTimer={startTimer}
                    onStopTimer={stopTimer}
                    onAddTime={addTime}
                />
                <LandingSection />
            </main>
            <Footer />
        </div>
    );
}

export default App;
