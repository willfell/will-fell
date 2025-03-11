module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css,scss}'],
  // darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'earth-tan': '#DBBB9C',
        'coral': '#E89375',
        'terracotta': '#B97475',
        'slate-blue': '#475771',
        'forest-green': '#5E6746',
        'sage-green': '#7D8A69',
        'deep-forest': '#3A4428',
        'stone-black': '#2A2A2A',
        'canyon-red': '#9b2c2c',
        'canyon-tan': '#E4D5B7',
        yellow: '#efc603',
      },
      keyframes: {
        typing: {
          '0%, 100%': {width: '0%'},
          '30%, 70%': {width: '100%'},
        },
        blink: {
          '0%': {
            opacity: 0,
          },
        },
        'rotate-loader': {
          '0%': {
            transform: 'rotate(0deg)',
            strokeDashoffset: '360%',
          },
          '100%': {
            transform: 'rotate(360deg)',
            strokeDashoffset: '-360%',
          },
        },
      },
      screens: {
        touch: {raw: 'only screen and (pointer: coarse)'},
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};