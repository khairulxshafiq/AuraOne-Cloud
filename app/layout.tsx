import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AuraOne Cloud — Multi-Agent AI OS (Malaysia)',
  description:
    'Platform multi-ejen AI perbualan dan operasi perniagaan BM-first untuk solopreneur & enterprise.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
