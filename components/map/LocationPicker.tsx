'use client';

import { useState, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl';
import type { MapMouseEvent } from 'mapbox-gl';
import {
  MAURITIUS_CENTER,
  MAURITIUS_ZOOM,
  MAURITIUS_MIN_ZOOM,
  MAURITIUS_BOUNDS,
  MAPBOX_STYLE_LIGHT,
  MAPBOX_TOKEN,
} from '@/lib/mapbox/config';
import type { LngLatBoundsLike } from 'mapbox-gl';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [pin, setPin] = useState(value ?? null);

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      const newPin = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      setPin(newPin);
      onChange(newPin.lat, newPin.lng);
    },
    [onChange],
  );

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border-2 border-ocean-200 hover:border-ocean-400 transition-colors">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: MAURITIUS_CENTER[0],
          latitude: MAURITIUS_CENTER[1],
          zoom: MAURITIUS_ZOOM,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_STYLE_LIGHT}
        minZoom={MAURITIUS_MIN_ZOOM}
        maxBounds={MAURITIUS_BOUNDS as LngLatBoundsLike}
        onClick={handleClick}
        cursor="crosshair"
        attributionControl={false}
      >
        {pin && (
          <Marker longitude={pin.lng} latitude={pin.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-coral-500 fill-coral-100 drop-shadow-md" />
            </div>
          </Marker>
        )}
      </Map>
      {!pin && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md text-sm text-ocean-600 font-medium">
            Click on the map to place your location
          </div>
        </div>
      )}
      {pin && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs text-ocean-600 font-mono shadow-sm">
          {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
        </div>
      )}
    </div>
  );
}
