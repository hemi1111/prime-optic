/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f7ff',
          100: '#e4edff',
          200: '#c4d7ff',
          300: '#9cb7ff',
          400: '#6283ff',
          500: '#3055f5',
          600: '#213fce',
          700: '#1b34a3',
          800: '#172c82',
          900: '#132567',
        },
        accent: {
          50: '#fff9f3',
          100: '#ffeedb',
          200: '#ffd5a8',
          300: '#ffb76b',
          400: '#ff9833',
          500: '#ff7f0a',
          600: '#db6404',
          700: '#b14c07',
          800: '#8a3c0d',
          900: '#6e320f',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        medium: '0 20px 40px rgba(15, 23, 42, 0.12)',
        strong: '0 25px 50px rgba(15, 23, 42, 0.15)',
        glow: '0 0 20px rgba(48, 85, 245, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


