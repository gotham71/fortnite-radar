/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/**/*.{html,ts}",
    "./libs/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1E1E2F',  // Gris oscuro
        accent: '#FBBF24',      // Amarillo neón
        text: '#F1F5F9',
        primary: '#243e46', // Verde oscuro
        secondary: '#196145', // Verde normal
        third: '#38985e', // Verde claro
        fourth: '#6eaa61', // Verde electrico        // Gris claro
      },
      fontFamily: {
        sans: ['"Rubik"', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

