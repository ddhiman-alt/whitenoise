import React, { useState } from "react";

const PRESET_TIMES = [
    { label: "5m", minutes: 5 },
    { label: "15m", minutes: 15 },
    { label: "30m", minutes: 30 },
    { label: "45m", minutes: 45 },
    { label: "1h", minutes: 60 },
    { label: "2h", minutes: 120 },
];

const Timer = ({
    isTimerActive,
    timeRemaining,
    formatTime,
    onStartTimer,
    onStopTimer,
    onAddTime,
    hasActiveSounds,
}) => {
    const [showTimerModal, setShowTimerModal] = useState(false);
    const [customMinutes, setCustomMinutes] = useState("");

    const handlePresetClick = (minutes) => {
        onStartTimer(minutes);
        setShowTimerModal(false);
    };

    const handleCustomStart = () => {
        const minutes = parseInt(customMinutes, 10);
        if (minutes > 0 && minutes <= 720) {
            onStartTimer(minutes);
            setCustomMinutes("");
            setShowTimerModal(false);
        }
    };

    const handleCloseModal = () => {
        setShowTimerModal(false);
        setCustomMinutes("");
    };

    return (
        <>
            {/* Timer Display/Button */}
            <div className="timer-container">
                {isTimerActive ? (
                    <div className="timer-active">
                        <div className="timer-display">
                            <span className="timer-icon">⏱️</span>
                            <span className="timer-time">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                        <div className="timer-actions">
                            <button
                                className="timer-action-btn add-time-btn"
                                onClick={() => onAddTime(5)}
                                title="Add 5 minutes"
                            >
                                +5m
                            </button>
                            <button
                                className="timer-action-btn add-time-btn"
                                onClick={() => onAddTime(15)}
                                title="Add 15 minutes"
                            >
                                +15m
                            </button>
                            <button
                                className="timer-action-btn stop-timer-btn"
                                onClick={onStopTimer}
                                title="Stop timer"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="control-btn timer-btn"
                        onClick={() => setShowTimerModal(true)}
                        disabled={!hasActiveSounds}
                        title="Set sleep timer"
                    >
                        ⏱️ Sleep Timer
                    </button>
                )}
            </div>

            {/* Timer Modal */}
            {showTimerModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div
                        className="modal timer-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>⏱️ Sleep Timer</h3>
                        <p>
                            Sounds will automatically stop after the selected
                            time
                        </p>

                        <div className="timer-presets">
                            {PRESET_TIMES.map((preset) => (
                                <button
                                    key={preset.minutes}
                                    className="timer-preset-btn"
                                    onClick={() =>
                                        handlePresetClick(preset.minutes)
                                    }
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        <div className="timer-custom">
                            <span className="timer-custom-label">
                                Or set custom time:
                            </span>
                            <div className="timer-custom-input-wrapper">
                                <input
                                    type="number"
                                    className="timer-custom-input"
                                    placeholder="Minutes"
                                    value={customMinutes}
                                    onChange={(e) =>
                                        setCustomMinutes(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleCustomStart()
                                    }
                                    min="1"
                                    max="720"
                                />
                                <button
                                    className="timer-custom-start-btn"
                                    onClick={handleCustomStart}
                                    disabled={
                                        !customMinutes ||
                                        parseInt(customMinutes, 10) <= 0
                                    }
                                >
                                    Start
                                </button>
                            </div>
                        </div>

                        <div className="modal-buttons">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Timer;
