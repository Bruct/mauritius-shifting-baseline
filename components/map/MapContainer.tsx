'use client';

import { useState, useCallback, useRef } from 'react';
import Map, { NavigationControl, GeolocateControl, type MapRef } from 'react-map-gl';
import type { MapMouseEvent, LngLatBoundsLike } from 'mapbox-gl';
import {
  MAURITIUS_CENTER,
  MAURITIUS_ZOOM,
  MAURITIUS_MIN_ZOOM,
  MAURITIUS_BOUNDS,
  MAPBOX_STYLE,
  MAPBOX_TOKEN,
} from '@/lib/mapbox/config';
import { LocationPin } from './LocationPin';
import { LocationPopup } from './LocationPopup';
import { TimelineSlider } from './TimelineSlider';
import { MapLegend } from './MapLegend';
import type { LocationWithCount } from '@/lib/supabase/types';

interface MapContainerProps {
  locations: LocationWithCount[];
  onLocationClick?: (locationId: string) => void;
  enablePinDrop?: boolean;
  onPinDrop?: (lat: number, lng: number) => void;
}

export function MapContainer({
  locations,
  onLocationClick,
  enablePinDrop = false,
  onPinDrop,
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationWithCount | null>(null);
  const [decadeFilter, setDecadeFilter] = useState<number | null>(null);
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (enablePinDrop && onPinDrop) {
        setDroppedPin({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        onPinDrop(e.lngLat.lat, e.lngLat.lng);
      }
    },
    [enablePinDrop, onPinDrop],
  );

  const handleLocationClick = useCallback(
    (location: LocationWithCount) => {
      setSelectedLocation(location);
      mapRef.current?.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 14,
        duration: 1200,
      });
      onLocationClick?.(location.id);
    },
    [onLocationClick],
  );

  const handlePopupClose = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: MAURITIUS_CENTER[0],
          latitude: MAURITIUS_CENTER[1],
          zoom: MAURITIUS_ZOOM,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_STYLE}
        minZoom={MAURITIUS_MIN_ZOOM}
        maxBounds={MAURITIUS_BOUNDS as LngLatBoundsLike}
        onClick={handleMapClick}
        cursor={enablePinDrop ? 'crosshair' : 'auto'}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Location pins */}
        {locations.map((location) => (
          <LocationPin
            key={location.id}
            location={location}
            isSelected={selectedLocation?.id === location.id}
            onClick={() => handleLocationClick(location)}
          />
        ))}

        {/* Selected location popup */}
        {selectedLocation && (
          <LocationPopup
            location={selectedLocation}
            decadeFilter={decadeFilter}
            onClose={handlePopupClose}
          />
        )}

        {/* Dropped pin for submission */}
        {droppedPin && enablePinDrop && (
          <LocationPin
            location={{
              id: 'new',
              name: 'New location',
              latitude: droppedPin.lat,
              longitude: droppedPin.lng,
              description: null,
              created_by: null,
              created_at: '',
              testimony_count: 0,
            }}
            isSelected
            isNew
          />
        )}
      </Map>

      {/* Timeline slider overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
        <TimelineSlider value={decadeFilter} onChange={setDecadeFilter} />
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10">
        <MapLegend />
      </div>
    </div>
  );
}
