import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'המקפצה — קורס AI למובילי המגזר הציבורי',
  description: '12 קורסים מעשיים בבינה מלאכותית למובילי AI בממשלת ישראל',
  metadataBase: new URL('https://avi1840.github.io/ai-academy'),
  openGraph: {
    title: '🚀 המקפצה — קורס AI למובילי המגזר הציבורי',
    description: '12 קורסים מעשיים ב-AI למובילי ממשלה — חינם, ישומי, ברמה בינלאומית',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; connect-src 'self';"
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
