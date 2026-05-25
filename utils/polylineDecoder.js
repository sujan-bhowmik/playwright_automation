import polyline from "@mapbox/polyline";

export function decodePolyline(encoded) {
  return polyline.decode(encoded).map(([lat, lon]) => ({
    lat,
    lon,
  }));
}
