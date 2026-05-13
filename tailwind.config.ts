import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cute palette: white, soft gray, blue
        background: '#FFFFFF',
        foreground: '#1F2937',
        card: '#F8FAFC',
        'card-hover': '#F1F5F9',
        border: '#E2E8F0',
        'border-hover': '#CBD5E1',
        muted: '#64748B',
        accent: '#3B82F6',
        'accent-hover': '#2563EB',
        'accent-dim': 'rgba(59, 130, 246, 0.08)',

        // Section backgrounds
        'section-green-bg': '#DBEAFE',
        'section-green-border': '#BFDBFE',
        'section-lavender-bg': '#EDE9FE',
        'section-lavender-border': '#DDD6FE',
        'section-warm-bg': '#FEF3C7',
        'section-warm-border': '#FDE68A',
      },
      fontFamily: {
        sans: 'var(--font-poppins), system-ui, sans-serif',
        mono: 'var(--font-geist-mono)',
        serif: 'var(--font-lora)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
