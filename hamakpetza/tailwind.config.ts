import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        accent: '#d97757',
        'accent-light': 'var(--color-accent-light)',
        secondary: '#6a9bcc',
        'secondary-light': 'var(--color-secondary-light)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
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
            color: 'var(--color-text)',
            maxWidth: '48rem',
            h1: { fontFamily: 'Heebo, sans-serif', fontWeight: '800', color: 'var(--color-text)' },
            h2: { fontFamily: 'Heebo, sans-serif', fontWeight: '700', color: 'var(--color-text)' },
            h3: { fontFamily: 'Heebo, sans-serif', fontWeight: '600', color: 'var(--color-text)' },
            h4: { fontFamily: 'Heebo, sans-serif', fontWeight: '600', color: 'var(--color-text)' },
            a: { color: '#d97757', textDecoration: 'underline', textUnderlineOffset: '3px' },
            strong: { color: 'var(--color-text)' },
            code: { fontFamily: '"Fira Code", monospace', fontSize: '0.9em', color: '#d97757' },
            blockquote: { borderInlineStartColor: '#d97757', color: 'var(--color-muted)' },
            'ol > li::marker': { color: '#d97757' },
            'ul > li::marker': { color: '#d97757' },
            hr: { borderColor: 'var(--color-border)' },
            th: { color: 'var(--color-text)' },
            td: { color: 'var(--color-text)' },
            thead: { borderBottomColor: 'var(--color-border)' },
            'tbody tr': { borderBottomColor: 'var(--color-border)' },
            pre: { backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
