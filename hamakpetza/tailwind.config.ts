import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        surface: '#1a1d2e',
        text: '#e8e6e3',
        accent: '#d97757',
        'accent-light': 'rgba(217,119,87,0.12)',
        secondary: '#6a9bcc',
        'secondary-light': 'rgba(106,155,204,0.12)',
        muted: '#9ca3af',
        border: '#2a2d3e',
      },
      fontFamily: {
        heading: ['var(--font-heebo)', 'Heebo', 'Assistant', 'Rubik', 'sans-serif'],
        body: ['var(--font-frank-ruhl-libre)', '"Frank Ruhl Libre"', 'Alef', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      fontSize: {
        base: ['18px', { lineHeight: '1.7' }],
      },
      maxWidth: {
        reading: '48rem',
        dashboard: '72rem',
      },
      typography: {
        DEFAULT: {
          css: {
            direction: 'rtl',
            fontFamily: '"Frank Ruhl Libre", Alef, serif',
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#e8e6e3',
            maxWidth: '48rem',
            h1: { fontFamily: 'Heebo, sans-serif', fontWeight: '800', color: '#e8e6e3' },
            h2: { fontFamily: 'Heebo, sans-serif', fontWeight: '700', color: '#e8e6e3' },
            h3: { fontFamily: 'Heebo, sans-serif', fontWeight: '600', color: '#e8e6e3' },
            h4: { fontFamily: 'Heebo, sans-serif', fontWeight: '600', color: '#e8e6e3' },
            a: { color: '#d97757', textDecoration: 'underline', textUnderlineOffset: '3px' },
            strong: { color: '#e8e6e3' },
            code: { fontFamily: '"Fira Code", monospace', fontSize: '0.9em', color: '#d97757' },
            blockquote: { borderInlineStartColor: '#d97757', color: '#9ca3af' },
            'ol > li::marker': { color: '#d97757' },
            'ul > li::marker': { color: '#d97757' },
            hr: { borderColor: '#2a2d3e' },
            th: { color: '#e8e6e3' },
            td: { color: '#e8e6e3' },
            thead: { borderBottomColor: '#2a2d3e' },
            'tbody tr': { borderBottomColor: '#2a2d3e' },
            pre: { backgroundColor: '#1a1d2e', color: '#e8e6e3' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
