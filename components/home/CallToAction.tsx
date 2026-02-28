'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { motion } from 'framer-motion';
import { Mic, Fish } from 'lucide-react';

export function CallToAction() {
  const t = useTranslations('submission');

  return (
    <section className="py-20 bg-ocean-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/10"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
              right: -50 + i * -40,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Fish
                  key={i}
                  className="h-6 w-6 text-ocean-200"
                  style={{ transform: i % 2 === 0 ? 'scaleX(-1)' : 'none' }}
                  strokeWidth={1.5}
                />
              ))}
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-ocean-200 text-lg mb-8 leading-relaxed">
            {t('subtitle')}
          </p>
          <Link
            href="/testimonies/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ocean-700 font-bold rounded-xl hover:bg-ocean-50 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <Mic className="h-5 w-5" />
            {t('submit')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
