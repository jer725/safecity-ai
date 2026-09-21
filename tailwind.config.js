/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0d1a',
          900: '#11162b',
          850: '#151b34',
          800: '#1a1f3a', // Primary background
          700: '#232a4e',
          600: '#2d3766',
        },
        charcoal: {
          900: '#1f2735',
          800: '#2d3748', // Charcoal secondary
          700: '#3d4b61',
          600: '#4a5568',
        },
        emergency: {
          DEFAULT: '#ff3333', // Emergency Red
          dark: '#cc0000',
          light: '#ff6666',
          glow: 'rgba(255, 51, 51, 0.4)',
        },
        cyan: {
          DEFAULT: '#00d4ff', // Cyan tracking
          dark: '#00a3cc',
          light: '#5ce1e6',
          glow: 'rgba(0, 212, 255, 0.4)',
        }
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'glow-red': '0 0 15px rgba(255, 51, 51, 0.5)',
        'glow-cyan': '0 0 15px rgba(0, 212, 255, 0.5)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.5)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radarSweep 3s linear infinite',
        'scanline': 'scanline 6s linear infinite',
        'beacon': 'beacon 2s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        beacon: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
