/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EAF2FC', 100: '#CCE0F8', 200: '#99C0F0', 300: '#5C99E6', 400: '#2E79D6',
          500: '#0C5FC5', 600: '#0A4FA6', 700: '#093F84', 800: '#082F63', 900: '#06234A',
          DEFAULT: '#0C5FC5',
        },
        accent: {
          50: '#E6FAFB', 100: '#C2F1F3', 200: '#8AE3E8', 300: '#4FCFD6', 400: '#1FB6BF',
          500: '#0E9AA7', 600: '#0B7C87', 700: '#0A626B', 800: '#084A51', 900: '#063338',
          DEFAULT: '#0E9AA7',
        },
        neutral: {
          0: '#FFFFFF', 50: '#F7F8FA', 100: '#EEF0F4', 200: '#E2E5EB', 300: '#CBD0D9',
          400: '#9AA2B1', 500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2733', 900: '#0F141B',
        },
        success: { DEFAULT: '#1F9D57', bg: '#E6F6EE', text: '#13753F' },
        warning: { DEFAULT: '#C77700', bg: '#FFF4E0', text: '#945800' },
        error:   { DEFAULT: '#D92D20', bg: '#FDECEA', text: '#A31C12' },
        info:    { DEFAULT: '#0C5FC5', bg: '#EAF2FC', text: '#093F84' },
        chart: { 1: '#0C5FC5', 2: '#0E9AA7', 3: '#7C5CFC', 4: '#E8833A', 5: '#E0457B', 6: '#2BB673' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: ['40px', { lineHeight: '1.1',  fontWeight: '700', letterSpacing: '-0.02em' }],
        h1:      ['32px', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        h2:      ['24px', { lineHeight: '1.33', fontWeight: '700', letterSpacing: '-0.01em' }],
        h3:      ['20px', { lineHeight: '1.4',  fontWeight: '600' }],
        h4:      ['18px', { lineHeight: '1.44', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.5',  fontWeight: '400' }],
        body:    ['14px', { lineHeight: '1.57', fontWeight: '400' }],
        small:   ['13px', { lineHeight: '1.38', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.33', fontWeight: '500' }],
      },
      borderRadius: { sm: '6px', md: '10px', lg: '14px', xl: '20px', full: '999px' },
      boxShadow: {
        sm: '0 1px 2px rgba(15,20,27,.06), 0 1px 3px rgba(15,20,27,.08)',
        md: '0 4px 12px rgba(15,20,27,.08), 0 2px 4px rgba(15,20,27,.05)',
        lg: '0 12px 32px rgba(15,20,27,.12), 0 4px 8px rgba(15,20,27,.06)',
      },
      minHeight: { tap: '44px' },
      minWidth:  { tap: '44px' },
    },
  },
  plugins: [],
};
