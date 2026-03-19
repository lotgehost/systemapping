import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'System Mapper — AI-powered causal loop mapping',
  description: 'Describe any complex system and AI builds a causal loop diagram.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {children}
        <p
          className="fixed bottom-4 left-0 right-0 text-center text-[11px] pointer-events-none z-50"
          style={{ color: 'rgba(30,30,40,0.3)' }}
        >
          © {new Date().getFullYear()} hjngk
        </p>
      </body>
    </html>
  );
}
