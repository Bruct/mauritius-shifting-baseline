// Mauritius bounding box
export const MAURITIUS_BOUNDS: [[number, number], [number, number]] = [
  [56.51, -20.53], // SW
  [63.73, -19.52], // NE (includes Rodrigues)
];

export const MAURITIUS_CENTER: [number, number] = [57.5522, -20.2];
export const MAURITIUS_ZOOM = 10;
export const MAURITIUS_MIN_ZOOM = 8;
export const MAURITIUS_MAX_ZOOM = 18;

// Mapbox style - ocean-focused
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';
export const MAPBOX_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';

// Health trend colors for pins
export const PIN_COLORS = {
  improving: '#22c55e',   // green
  stable: '#3BBFBF',      // teal
  declining: '#E8856A',   // coral
  unknown: '#94a3b8',     // slate
} as const;

// Cluster colors
export const CLUSTER_COLORS = {
  small: '#1E8FA0',    // < 5 points
  medium: '#0A2342',   // 5-20 points
  large: '#E8856A',    // > 20 points
} as const;

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
