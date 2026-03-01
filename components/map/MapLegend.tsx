'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

export function MapLegend() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-ocean-100 text-xs font-medium text-ocean-600 hover:bg-white transition-colors"
      >
        <Info className="h-3.5 w-3.5" />
        Legend
      </button>
      {visible && (
        <div className="absolute top-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-ocean-100 p-3 w-44">
          <p className="text-xs font-semibold text-ocean-700 mb-2 uppercase tracking-wider">
            Pin count
          </p>
          {[
            { color: '#3BBFBF', label: '1 testimony' },
            { color: '#1E8FA0', label: '2–4 testimonies' },
            { color: '#E8856A', label: '5+ testimonies' },
            { color: '#94a3b8', label: 'No testimonies' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-1.5">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-ocean-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
