import React from "react";

const SoundCard = ({ sound, volume, onVolumeChange }) => {
    const isActive = volume > 0;

    const increaseVolume = () => {
        if (volume < 100) {
            onVolumeChange(sound.id, Math.min(volume + 10, 100));
        }
    };

    const decreaseVolume = () => {
        if (volume > 0) {
            onVolumeChange(sound.id, Math.max(volume - 10, 0));
        }
    };

    const muteVolume = () => {
        onVolumeChange(sound.id, 0);
    };

    const maxVolume = () => {
        onVolumeChange(sound.id, 100);
    };

    return (
        <div className={`sound-card ${isActive ? "active" : ""}`}>
            <div className="sound-info">
                <span className="sound-icon">{sound.icon}</span>
                <span className="sound-name">{sound.name}</span>
            </div>
            <div className="volume-controls">
                <button
                    className="volume-btn-quick mute-btn"
                    onClick={muteVolume}
                    disabled={volume === 0}
                    aria-label="Mute"
                    title="Mute"
                >
                    🔇
                </button>
                <button
                    className="volume-btn"
                    onClick={decreaseVolume}
                    disabled={volume === 0}
                    aria-label="Decrease volume"
                >
                    −
                </button>
                <div className="volume-bar">
                    <div
                        className="volume-fill"
                        style={{ width: `${volume}%` }}
                    />
                </div>
                <button
                    className="volume-btn"
                    onClick={increaseVolume}
                    disabled={volume === 100}
                    aria-label="Increase volume"
                >
                    +
                </button>
                <button
                    className="volume-btn-quick max-btn"
                    onClick={maxVolume}
                    disabled={volume === 100}
                    aria-label="Max volume"
                    title="Max volume"
                >
                    🔊
                </button>
            </div>
        </div>
    );
};

export default SoundCard;
