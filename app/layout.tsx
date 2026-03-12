import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'System Mapper — AI 시스템 매핑 도구',
  description: '복잡한 사회문제를 AI와 함께 시스템으로 이해합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
