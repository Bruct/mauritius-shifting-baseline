'use client';

import dynamic from 'next/dynamic';
import type { LocationWithCount } from '@/lib/supabase/types';

// Dynamic import to avoid SSR issues with Mapbox
const MapContainer = dynamic(() => import('./MapContainer').then(m => ({ default: m.MapContainer })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-ocean-50">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-ocean-200 border-t-ocean-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-ocean-500">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapViewProps {
  locations: LocationWithCount[];
}

export function MapView({ locations }: MapViewProps) {
  return <MapContainer locations={locations} />;
}
