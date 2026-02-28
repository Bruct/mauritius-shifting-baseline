import { Fish, Heart, ExternalLink } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';

export function Footer() {
  return (
    <footer className="border-t border-ocean-100 bg-ocean-950 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-500/20">
                <Fish className="h-4 w-4 text-ocean-300" strokeWidth={1.5} />
              </div>
              <span className="font-display font-bold text-white">Shifting Baseline</span>
            </div>
            <p className="text-sm text-ocean-400 leading-relaxed">
              Documenting the living memory of Mauritius&apos;s marine ecosystem — one testimony at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-ocean-200 mb-3 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/map', label: 'Memory Map' },
                { href: '/species', label: 'Species Encyclopedia' },
                { href: '/testimonies/submit', label: 'Share Your Memory' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ocean-400 hover:text-ocean-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h3 className="text-sm font-semibold text-ocean-200 mb-3 uppercase tracking-wider">About</h3>
            <p className="text-sm text-ocean-400 leading-relaxed mb-3">
              A research initiative to combat shifting baseline syndrome in Mauritian coastal communities.
            </p>
            <p className="text-xs text-ocean-500">
              Data collected under informed consent. All testimonies are verified before publication.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-ocean-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ocean-500">
            © {new Date().getFullYear()} Mauritius Shifting Baseline Project
          </p>
          <p className="flex items-center gap-1 text-xs text-ocean-500">
            Made with <Heart className="h-3 w-3 text-coral-500 fill-coral-500" /> for Mauritius&apos;s ocean
          </p>
        </div>
      </div>
    </footer>
  );
}
