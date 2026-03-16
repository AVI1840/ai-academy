import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#faf9f5',
        surface: '#f5f4f0',
        text: '#141413',
        accent: '#d97757',
        'accent-light': '#f5ebe6',
        secondary: '#6a9bcc',
        'secondary-light': '#e8f0f7',
        muted: '#8c8c84',
        border: '#e5e4df',
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
            color: '#141413',
            maxWidth: '48rem',
            h1: { fontFamily: 'Heebo, sans-serif', fontWeight: '800', color: '#141413' },
            h2: { fontFamily: 'Heebo, sans-serif', fontWeight: '700', color: '#141413' },
            h3: { fontFamily: 'Heebo, sans-serif', fontWeight: '600', color: '#141413' },
            h4: { fontFamily: 'Heebo, sans-serif', fontWeight: '600', color: '#141413' },
            a: { color: '#d97757', textDecoration: 'underline', textUnderlineOffset: '3px' },
            strong: { color: '#141413' },
            code: { fontFamily: '"Fira Code", monospace', fontSize: '0.9em' },
            blockquote: { borderInlineStartColor: '#d97757' },
            'ol > li::marker': { color: '#d97757' },
            'ul > li::marker': { color: '#d97757' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
