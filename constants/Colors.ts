const tintColorLight = '#6366f1'; // Indigo to match app theme
const tintColorDark = '#818cf8';  // Lighter indigo for dark mode

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#9ca3af', // Gray-400 for better contrast
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#6b7280', // Gray-500 for dark mode
    tabIconSelected: tintColorDark,
  },
};
