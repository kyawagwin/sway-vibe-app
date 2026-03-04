// Convert degrees to radians
export function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Convert radians to degrees
export function toDeg(rad: number): number {
    return rad * (180 / Math.PI);
}

/**
 * Calculates the great-circle distance between two points in meters.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Calculates the initial bearing (forward azimuth) from point 1 to point 2 in degrees.
 * Returns angle between 0 and 360.
 */
export function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const startLat = toRad(lat1);
    const startLng = toRad(lon1);
    const destLat = toRad(lat2);
    const destLng = toRad(lon2);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x =
        Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);

    let brng = Math.atan2(y, x);
    brng = toDeg(brng);

    return (brng + 360) % 360;
}
