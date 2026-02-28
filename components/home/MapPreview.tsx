import { Link } from '@/lib/i18n/routing';
import { Map, ArrowRight } from 'lucide-react';

export function MapPreview() {
  return (
    <section className="py-16 bg-seafoam">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-ocean-500 text-sm font-semibold uppercase tracking-wider">
              Interactive Map
            </span>
            <h2 className="mt-2 text-3xl font-display font-bold text-ocean-900">
              Explore Mauritius&apos;s Marine Memory
            </h2>
            <p className="mt-4 text-ocean-600 leading-relaxed">
              Browse testimonies by location around the island. Each pin represents a place where
              someone&apos;s memory lives — from the coral reefs of Blue Bay to the lagoons of
              Grand Baie.
            </p>
            <p className="mt-3 text-ocean-600 leading-relaxed">
              Use the timeline slider to travel through decades and witness how the ecosystem
              has shifted through the eyes of those who knew it best.
            </p>
            <Link
              href="/map"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-ocean-500 text-white font-semibold rounded-xl hover:bg-ocean-600 transition-colors"
            >
              <Map className="h-4 w-4" />
              Open the Map
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Map placeholder / preview */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-ocean-900/20 aspect-[4/3]">
            <div className="absolute inset-0 bg-ocean-gradient opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Stylized Mauritius shape */}
              <svg viewBox="0 0 200 180" className="w-48 h-48 opacity-40">
                <path
                  d="M100 20 C130 25 160 40 165 70 C170 100 160 130 140 150 C120 170 80 175 60 160 C40 145 30 120 35 90 C40 60 55 30 80 20 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
            {/* Fake pins */}
            {[
              { top: '35%', left: '55%' },
              { top: '55%', left: '40%' },
              { top: '70%', left: '65%' },
              { top: '45%', left: '30%' },
              { top: '25%', left: '45%' },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-coral-400 shadow-lg shadow-coral-400/50 animate-pulse-slow"
                style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.5}s` }}
              />
            ))}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                🗺️ Click to explore the full interactive map
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
