import { useState, useCallback, useEffect, useRef } from "react";

const useWakeLock = () => {
    const [isWakeLockActive, setIsWakeLockActive] = useState(false);
    const [isWakeLockSupported, setIsWakeLockSupported] = useState(false);
    const wakeLockRef = useRef(null);

    // Check if Wake Lock API is supported
    useEffect(() => {
        setIsWakeLockSupported("wakeLock" in navigator);
    }, []);

    // Request wake lock
    const requestWakeLock = useCallback(async () => {
        if (!isWakeLockSupported) {
            console.log("Wake Lock API not supported");
            return false;
        }

        try {
            wakeLockRef.current = await navigator.wakeLock.request("screen");
            setIsWakeLockActive(true);
            console.log("Wake Lock activated");

            // Listen for wake lock release
            wakeLockRef.current.addEventListener("release", () => {
                console.log("Wake Lock released");
                setIsWakeLockActive(false);
            });

            return true;
        } catch (err) {
            console.error("Wake Lock request failed:", err);
            setIsWakeLockActive(false);
            return false;
        }
    }, [isWakeLockSupported]);

    // Release wake lock
    const releaseWakeLock = useCallback(async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
                setIsWakeLockActive(false);
                console.log("Wake Lock manually released");
            } catch (err) {
                console.error("Wake Lock release failed:", err);
            }
        }
    }, []);

    // Re-acquire wake lock when page becomes visible again
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === "visible" && isWakeLockActive && !wakeLockRef.current) {
                await requestWakeLock();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isWakeLockActive, requestWakeLock]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release();
            }
        };
    }, []);

    return {
        isWakeLockActive,
        isWakeLockSupported,
        requestWakeLock,
        releaseWakeLock,
    };
};

export default useWakeLock;
