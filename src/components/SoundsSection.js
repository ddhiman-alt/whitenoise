import React, { useState } from "react";
import { categories } from "../data/sounds";
import Timer from "./Timer";

const SoundsSection = ({
    sounds,
    volumes,
    onVolumeChange,
    onResetAll,
    playlists,
    onSavePlaylist,
    onLoadPlaylist,
    onDeletePlaylist,
    // Timer props
    isTimerActive,
    timeRemaining,
    formatTime,
    onStartTimer,
    onStopTimer,
    onAddTime,
}) => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [saveError, setSaveError] = useState("");

    // Check if any sound is active
    const hasActiveSounds = Object.values(volumes).some((v) => v > 0);
    const activeSoundCount = Object.values(volumes).filter((v) => v > 0).length;

    const handleSavePlaylist = () => {
        if (playlistName.trim()) {
            const result = onSavePlaylist(playlistName.trim());
            if (result.success) {
                setPlaylistName("");
                setSaveError("");
                setShowSaveModal(false);
            } else {
                setSaveError(result.error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowSaveModal(false);
        setPlaylistName("");
        setSaveError("");
    };

    const getPlaylistSoundCount = (playlist) => {
        return Object.values(playlist.volumes).filter((v) => v > 0).length;
    };

    const increaseVolume = (soundId, currentVolume) => {
        if (currentVolume < 100) {
            onVolumeChange(soundId, Math.min(currentVolume + 10, 100));
        }
    };

    const decreaseVolume = (soundId, currentVolume) => {
        if (currentVolume > 0) {
            onVolumeChange(soundId, Math.max(currentVolume - 10, 0));
        }
    };

    const muteVolume = (soundId) => {
        onVolumeChange(soundId, 0);
    };

    const maxVolume = (soundId) => {
        onVolumeChange(soundId, 100);
    };

    const filteredSounds =
        activeCategory === "all"
            ? sounds
            : sounds.filter((sound) => sound.category === activeCategory);

    return (
        <section className="sounds-section">
            <h2>🎧 Sound Library</h2>

            {/* Common Controls */}
            <div className="common-controls">
                <div className="active-sounds-info">
                    {hasActiveSounds ? (
                        <span>
                            🔊 {activeSoundCount} sound
                            {activeSoundCount !== 1 ? "s" : ""} playing
                        </span>
                    ) : (
                        <span>🔇 No sounds playing</span>
                    )}
                </div>
                <div className="control-buttons">
                    <Timer
                        isTimerActive={isTimerActive}
                        timeRemaining={timeRemaining}
                        formatTime={formatTime}
                        onStartTimer={onStartTimer}
                        onStopTimer={onStopTimer}
                        onAddTime={onAddTime}
                        hasActiveSounds={hasActiveSounds}
                    />
                    <button
                        className="control-btn reset-btn"
                        onClick={onResetAll}
                        disabled={!hasActiveSounds}
                        title="Reset all sounds"
                    >
                        🔄 Reset All
                    </button>
                    <button
                        className="control-btn save-btn"
                        onClick={() => setShowSaveModal(true)}
                        disabled={!hasActiveSounds}
                        title="Save as playlist"
                    >
                        💾 Save Playlist
                    </button>
                    <button
                        className={`control-btn playlists-btn ${showPlaylists ? "active" : ""}`}
                        onClick={() => setShowPlaylists(!showPlaylists)}
                        title="View playlists"
                    >
                        📋 Playlists{" "}
                        {playlists.length > 0 && `(${playlists.length})`}
                    </button>
                </div>
            </div>

            {/* Save Playlist Modal */}
            {showSaveModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>💾 Save Playlist</h3>
                        <p>Save your current sound mix as a playlist</p>
                        {saveError && (
                            <div className="save-error">⚠️ {saveError}</div>
                        )}
                        <input
                            type="text"
                            className="playlist-name-input"
                            placeholder="Enter playlist name..."
                            value={playlistName}
                            onChange={(e) => {
                                setPlaylistName(e.target.value);
                                if (saveError) setSaveError("");
                            }}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSavePlaylist()
                            }
                            autoFocus
                        />
                        <div className="modal-buttons">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm-btn"
                                onClick={handleSavePlaylist}
                                disabled={!playlistName.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Playlists Panel */}
            {showPlaylists && (
                <div className="playlists-panel">
                    <h3>📋 Your Playlists</h3>
                    {playlists.length === 0 ? (
                        <p className="no-playlists">
                            No playlists yet. Save your current mix to create
                            one!
                        </p>
                    ) : (
                        <div className="playlists-list">
                            {playlists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    className="playlist-item"
                                >
                                    <div className="playlist-info">
                                        <span className="playlist-name">
                                            {playlist.name}
                                        </span>
                                        <span className="playlist-meta">
                                            {getPlaylistSoundCount(playlist)}{" "}
                                            sound
                                            {getPlaylistSoundCount(playlist) !==
                                            1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>
                                    <div className="playlist-actions">
                                        <button
                                            className="playlist-action-btn load-btn"
                                            onClick={() =>
                                                onLoadPlaylist(playlist.id)
                                            }
                                            title="Load playlist"
                                        >
                                            ▶️ Load
                                        </button>
                                        <button
                                            className="playlist-action-btn delete-btn"
                                            onClick={() =>
                                                onDeletePlaylist(playlist.id)
                                            }
                                            title="Delete playlist"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Category Filter */}
            <div className="category-filter">
                <button
                    className={`category-btn ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => setActiveCategory("all")}
                >
                    🎵 All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        {category.icon} {category.name}
                    </button>
                ))}
            </div>

            <div className="sounds-table-container">
                <table className="sounds-table">
                    <thead>
                        <tr>
                            <th>Sound</th>
                            <th>Volume</th>
                            <th>Controls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSounds.map((sound) => {
                            const volume = volumes[sound.id] || 0;
                            const isActive = volume > 0;
                            return (
                                <tr
                                    key={sound.id}
                                    className={isActive ? "active" : ""}
                                >
                                    <td className="sound-cell">
                                        <div className="sound-info">
                                            <span className="sound-icon">
                                                {sound.icon}
                                            </span>
                                            <span className="sound-name">
                                                {sound.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="volume-cell">
                                        <div className="volume-wrapper">
                                            <div className="volume-bar">
                                                <div
                                                    className="volume-fill"
                                                    style={{
                                                        width: `${volume}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="volume-text">
                                                {volume}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="controls-cell">
                                        <div className="controls-wrapper">
                                            <button
                                                className="volume-btn-quick mute-btn"
                                                onClick={() =>
                                                    muteVolume(sound.id)
                                                }
                                                disabled={volume === 0}
                                                aria-label="Mute"
                                                title="Mute"
                                            >
                                                🔇
                                            </button>
                                            <button
                                                className="volume-btn"
                                                onClick={() =>
                                                    decreaseVolume(
                                                        sound.id,
                                                        volume,
                                                    )
                                                }
                                                disabled={volume === 0}
                                                aria-label="Decrease volume"
                                            >
                                                −
                                            </button>
                                            <button
                                                className="volume-btn"
                                                onClick={() =>
                                                    increaseVolume(
                                                        sound.id,
                                                        volume,
                                                    )
                                                }
                                                disabled={volume === 100}
                                                aria-label="Increase volume"
                                            >
                                                +
                                            </button>
                                            <button
                                                className="volume-btn-quick max-btn"
                                                onClick={() =>
                                                    maxVolume(sound.id)
                                                }
                                                disabled={volume === 100}
                                                aria-label="Max volume"
                                                title="Max volume"
                                            >
                                                🔊
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default SoundsSection;
