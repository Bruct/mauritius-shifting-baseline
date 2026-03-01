'use client';

import { Marker } from 'react-map-gl';
import { motion } from 'framer-motion';
import type { LocationWithCount } from '@/lib/supabase/types';

interface LocationPinProps {
  location: LocationWithCount;
  isSelected?: boolean;
  isNew?: boolean;
  onClick?: () => void;
}

function getPinColor(count: number): string {
  if (count === 0) return '#94a3b8'; // grey - no testimonies
  if (count >= 5) return '#E8856A'; // coral - many (declining areas have more testimonies)
  if (count >= 2) return '#1E8FA0'; // teal - moderate
  return '#3BBFBF'; // lagoon - few
}

export function LocationPin({ location, isSelected, isNew, onClick }: LocationPinProps) {
  const color = isNew ? '#f59e0b' : getPinColor(location.testimony_count);
  const size = isSelected ? 40 : 32;

  return (
    <Marker
      longitude={location.longitude}
      latitude={location.latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.();
      }}
    >
      <motion.div
        initial={{ scale: 0, y: -10 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="cursor-pointer relative"
        style={{ width: size, height: size }}
        title={location.name}
        role="button"
        aria-label={`${location.name} — ${location.testimony_count} testimonies`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      >
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z"
            fill={color}
          />
          <path
            d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z"
            fill="black"
            fillOpacity="0.1"
          />
          <circle cx="16" cy="16" r="7" fill="white" fillOpacity="0.9" />
          {location.testimony_count > 0 && (
            <text
              x="16"
              y="20"
              textAnchor="middle"
              fontSize="8"
              fontWeight="bold"
              fill={color}
              fontFamily="system-ui"
            >
              {location.testimony_count > 99 ? '99+' : location.testimony_count}
            </text>
          )}
          {isNew && (
            <text x="16" y="20" textAnchor="middle" fontSize="10" fill="#f59e0b">
              +
            </text>
          )}
        </svg>

        {/* Selected ring */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white shadow-lg"
            style={{ borderColor: color }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </Marker>
  );
}
