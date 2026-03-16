import type { Metadata } from 'next';
import { Heebo, Frank_Ruhl_Libre } from 'next/font/google';
import '@/styles/globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-frank-ruhl-libre',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'המקפצה — אקדמיית AI למובילי המגזר הציבורי',
  description: 'מערכת ההפעלה של מנהיגות AI בממשלת ישראל — 15 יחידות מעשיות, חינמיות לחלוטין. ChatGPT, Gemini, NotebookLM, ענן ממשלתי, RAG ועוד.',
  metadataBase: new URL('https://avi1840.github.io/ai-academy'),
  keywords: ['AI', 'בינה מלאכותית', 'ממשלה', 'מגזר ציבורי', 'ChatGPT', 'Gemini', 'למידה', 'קורס'],
  authors: [{ name: 'אביעד יצחקי' }],
  openGraph: {
    title: '🚀 המקפצה — אקדמיית AI למגזר הציבורי',
    description: 'מה AI יכול לעשות בשבילך? 15 יחידות מעשיות — ChatGPT, Gemini, NotebookLM, ענן נימבוס, RAG ועוד. חינם לכל עובדי המדינה.',
    type: 'website',
    locale: 'he_IL',
    url: 'https://avi1840.github.io/ai-academy/',
    siteName: 'המקפצה',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🚀 המקפצה — אקדמיית AI ממשלתית',
    description: '15 יחידות AI מעשיות וחינמיות למובילי המגזר הציבורי בישראל',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frankRuhlLibre.variable}`}>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src https://fonts.gstatic.com",
            "img-src 'self' data:",
            "media-src 'self'",
            // Firebase Realtime Database (optional analytics)
            "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com",
          ].join('; ')}
        />
      </head>
      <body className="min-h-screen bg-bg text-text font-body">
        <a href="#main-content" className="skip-to-content">
          דלג לתוכן הראשי
        </a>
        {children}
      </body>
    </html>
  );
}
