import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mauritius Shifting Baseline | Voices of the Reef',
  description: 'A living archive of Mauritius marine heritage',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
