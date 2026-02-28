'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { TestimonyMedia } from '@/lib/supabase/types';
import { getSupabasePublicUrl } from '@/lib/utils';

interface PhotoGalleryProps {
  photos: TestimonyMedia[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null));

  return (
    <>
      <div className={`grid gap-2 ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-square rounded-lg overflow-hidden group bg-ocean-100"
          >
            <Image
              src={getSupabasePublicUrl(photo.storage_path)}
              alt={photo.caption ?? `Photo ${i + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-ocean-950/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative w-full max-w-3xl max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getSupabasePublicUrl(photos[lightboxIndex].storage_path)}
              alt={photos[lightboxIndex].caption ?? ''}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl object-contain max-h-[75vh]"
            />
            {photos[lightboxIndex].caption && (
              <p className="text-center text-sm text-white/70 mt-3">
                {photos[lightboxIndex].caption}
              </p>
            )}
          </div>

          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`h-1.5 rounded-full transition-all ${i === lightboxIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
