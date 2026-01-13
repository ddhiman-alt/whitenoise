import { useState, useCallback, useRef, useEffect } from "react";

const useTimer = (onTimerEnd) => {
    const [timerDuration, setTimerDuration] = useState(0); // in seconds
    const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
    const [isTimerActive, setIsTimerActive] = useState(false);
    const intervalRef = useRef(null);
    const endTimeRef = useRef(null);

    // Timer countdown effect
    useEffect(() => {
        if (isTimerActive) {
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const remaining = Math.floor((endTimeRef.current - now) / 1000);

                if (remaining <= 0) {
                    setTimeRemaining(0);
                    setIsTimerActive(false);
                    if (onTimerEnd) {
                        onTimerEnd();
                    }
                    clearInterval(intervalRef.current);
                } else {
                    setTimeRemaining(remaining);
                }
            }, 1000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [isTimerActive, onTimerEnd]);

    const startTimer = useCallback((durationInMinutes) => {
        const durationInSeconds = durationInMinutes * 60;
        const endTime = Date.now() + durationInSeconds * 1000;

        setTimerDuration(durationInSeconds);
        setTimeRemaining(durationInSeconds);
        setIsTimerActive(true);
        endTimeRef.current = endTime;
    }, []);

    const stopTimer = useCallback(() => {
        setIsTimerActive(false);
        setTimeRemaining(0);
        setTimerDuration(0);
        endTimeRef.current = null;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    const addTime = useCallback(
        (minutesToAdd) => {
            if (isTimerActive) {
                const additionalSeconds = minutesToAdd * 60;
                const newEndTime =
                    endTimeRef.current + additionalSeconds * 1000;
                const newRemaining = Math.floor(
                    (newEndTime - Date.now()) / 1000,
                );

                setTimeRemaining(newRemaining);
                setTimerDuration((prev) => prev + additionalSeconds);
                endTimeRef.current = newEndTime;
            }
        },
        [isTimerActive],
    );

    // Format time remaining as MM:SS or HH:MM:SS
    const formatTime = useCallback((seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }, []);

    return {
        timerDuration,
        timeRemaining,
        isTimerActive,
        startTimer,
        stopTimer,
        addTime,
        formatTime,
    };
};

export default useTimer;
