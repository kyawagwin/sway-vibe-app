import { useState, useEffect, useCallback } from "react";
import { getDistance, getBearing } from "@/utils/geo";

// iOS 13+ requires requesting permission for device orientation.
// We must declare this interface augmentation to avoid TypeScript errors
// since it's a non-standard Safari addition to the spec.
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
}

export function useCompass(targetLat?: number, targetLng?: number) {
    const [currentLat, setCurrentLat] = useState<number | null>(null);
    const [currentLng, setCurrentLng] = useState<number | null>(null);
    const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate dynamic values
    const distance = currentLat && currentLng && targetLat && targetLng
        ? getDistance(currentLat, currentLng, targetLat, targetLng)
        : null;

    const bearing = currentLat && currentLng && targetLat && targetLng
        ? getBearing(currentLat, currentLng, targetLat, targetLng)
        : null;

    // How much the arrow should rotate relative to the phone's heading
    const relativeArrowRotation = bearing !== null && deviceHeading !== null
        ? bearing - deviceHeading
        : null;

    const requestPermission = useCallback(async () => {
        try {
            // Setup Geolocation Watch
            if (!("geolocation" in navigator)) {
                throw new Error("Geolocation not supported");
            }

            navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentLat(position.coords.latitude);
                    setCurrentLng(position.coords.longitude);
                },
                (err) => {
                    setError(`Location Error: ${err.message}`);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );

            // Request Device Orientation (iOS 13+ Safari explicitly requires a user click to trigger this)
            const requestPerm = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;
            if (typeof requestPerm === "function") {
                const response = await requestPerm();
                if (response === "granted") {
                    setPermissionGranted(true);
                } else {
                    throw new Error("Compass permission denied");
                }
            } else {
                // Non-iOS 13+ devices
                setPermissionGranted(true);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to initialize sensors";
            setError(message);
        }
    }, []);

    useEffect(() => {
        if (!permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            // Using webkitCompassHeading for Safari (more accurate hardware heading)
            // fallback to alpha for Android
            let heading = null;
            if ('webkitCompassHeading' in event) {
                heading = (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
            } else if (event.alpha !== null) {
                // event.alpha is based against the device's original starting tilt, 
                // but standard absolute orientation usually maps roughly to alpha on Android Chrome
                heading = 360 - event.alpha;
            }

            if (heading !== null) {
                setDeviceHeading(heading);
            }
        };

        window.addEventListener("deviceorientationabsolute", handleOrientation, true);

        // Fallback for devices that don't emit the absolute event
        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
            window.removeEventListener("deviceorientation", handleOrientation, true);
        };
    }, [permissionGranted]);

    return {
        distance,
        bearing,
        deviceHeading,
        relativeArrowRotation,
        permissionGranted,
        requestPermission,
        error,
    };
}
