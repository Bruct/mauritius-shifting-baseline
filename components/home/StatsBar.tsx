'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageSquare, MapPin, Shell, Clock } from 'lucide-react';

interface StatsBarProps {
  stats: {
    testimonies: number;
    locations: number;
    species: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const t = useTranslations('stats');

  const items = [
    { icon: MessageSquare, value: stats.testimonies, label: t('testimonies'), color: 'text-ocean-500' },
    { icon: MapPin, value: stats.locations, label: t('locations'), color: 'text-coral-500' },
    { icon: Shell, value: stats.species, label: t('species'), color: 'text-ocean-400' },
    { icon: Clock, value: 80, label: t('years'), color: 'text-sandy-500' },
  ];

  return (
    <section className="bg-white border-b border-ocean-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <item.icon className={`h-6 w-6 mb-2 ${item.color}`} strokeWidth={1.5} />
              <span className="text-3xl font-display font-bold text-ocean-900">
                {item.value.toLocaleString()}
                {item.label === t('years') && '+'}
              </span>
              <span className="text-sm text-ocean-500 mt-1">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
