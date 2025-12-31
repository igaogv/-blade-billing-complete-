import React from 'react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1e293b',
        primary: '#0a2540',
        accent: '#2563eb',
        polished: '#f7fafc',
      }
    }
  },
  plugins: [],
};
