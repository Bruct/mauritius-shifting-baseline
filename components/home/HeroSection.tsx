'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { motion } from 'framer-motion';
import { Map, MessageSquare, ChevronDown } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated ocean background */}
      <div className="absolute inset-0 bg-deep-gradient" />

      {/* Underwater light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-px bg-gradient-to-b from-ocean-300/20 to-transparent"
            style={{ left: `${15 + i * 18}%`, height: '70%' }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [1, 2, 1] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
      </div>

      {/* Floating particles (bubbles) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 border border-white/20"
            style={{
              width: 4 + (i % 3) * 4,
              height: 4 + (i % 3) * 4,
              left: `${5 + i * 8}%`,
              bottom: '-20px',
            }}
            animate={{ y: [0, -(600 + i * 50)], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-ocean-400/20 border border-ocean-400/30 text-ocean-200 text-sm font-medium backdrop-blur-sm">
            🐟 Mauritius Marine Heritage Archive
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-6xl font-display font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {t('title')}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-ocean-200 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href="/map"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-ocean-400 hover:bg-ocean-300 text-ocean-950 font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-ocean-400/30 hover:-translate-y-0.5"
          >
            <Map className="h-5 w-5" />
            {t('cta_explore')}
          </Link>
          <Link
            href="/testimonies/submit"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-0.5"
          >
            <MessageSquare className="h-5 w-5" />
            {t('cta_share')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ocean-300 text-xs"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>{t('scroll')}</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
            fill="hsl(228 100% 97%)"
          />
        </svg>
      </div>
    </section>
  );
}
