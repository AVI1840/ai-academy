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
  description: 'מערכת ההפעלה של מנהיגות AI בממשלת ישראל — 16 יחידות מעשיות, חינמיות לחלוטין. ChatGPT, Gemini, NotebookLM, ענן ממשלתי, RAG, סוכני AI ועוד.',
  metadataBase: new URL('https://avi1840.github.io/ai-academy'),
  keywords: ['AI', 'בינה מלאכותית', 'ממשלה', 'מגזר ציבורי', 'ChatGPT', 'Gemini', 'למידה', 'קורס'],
  authors: [{ name: 'אביעד יצחקי' }],
  icons: { icon: '/ai-academy/favicon.svg' },
  openGraph: {
    title: 'המקפצה — אקדמיית AI למגזר הציבורי',
    description: '16 יחידות למידה מעשיות וחינמיות — Prompt Engineering, RAG, סוכני AI, ענן ממשלתי, NotebookLM ועוד. לכל מי שמוביל AI בממשלה.',
    type: 'website',
    locale: 'he_IL',
    url: 'https://avi1840.github.io/ai-academy/',
    siteName: 'המקפצה',
    images: [{ url: '/ai-academy/og-image.png', width: 1200, height: 630, alt: 'המקפצה — אקדמיית AI למגזר הציבורי' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'המקפצה — אקדמיית AI למגזר הציבורי',
    description: '16 יחידות למידה מעשיות וחינמיות למובילי AI במגזר הציבורי בישראל',
    images: ['/ai-academy/og-image.png'],
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
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src https://fonts.gstatic.com",
            "img-src 'self' data:",
            "media-src 'self'",
            // Firebase Realtime Database (optional analytics) + Google Apps Script (feedback)
            "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://script.google.com",
          ].join('; ')}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('hamakpetza_theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}`,
          }}
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
