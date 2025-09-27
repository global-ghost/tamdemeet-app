export function getDistanceInMeters(
  pos1: GeolocationPosition,
  pos2: GeolocationPosition,
): number {
  const R = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;

  const lat1 = pos1.coords.latitude;
  const lon1 = pos1.coords.longitude;
  const lat2 = pos2.coords.latitude;
  const lon2 = pos2.coords.longitude;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
