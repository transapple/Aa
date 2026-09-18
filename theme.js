// Central design system for the school app.
// Every screen pulls its palette, spacing, radii and shadows from here so
// the whole app feels like one consistent, considered product instead of
// a pile of separately-styled screens.

export const colors = {
  // Brand — deep indigo → violet, used for headers, primary actions & focus states
  primary: '#0B67D6',
  primaryDark: '#0752AE',
  primaryLight: '#4A9AF0',
  violet: '#6C3EEA',

  // Secondary accents, one per module so each area gets its own identity
  teal: '#0D9488',
  amber: '#D97706',
  rose: '#E11D48',
  coral: '#EF4444',
  sky: '#0284C7',
  emerald: '#059669',
  plum: '#9333EA',
  brown: '#92400E',

  success: '#10B981',
  successBg: '#DCFCE7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  info: '#3B82F6',
  infoBg: '#DBEAFE',

  bg: '#F4F8FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F9FE',
  border: '#EAEDF6',
  borderStrong: '#E0E4F2',

  ink: '#123D7A',
  inkSoft: '#496D9C',
  inkFaint: '#7890AA',
  placeholder: '#A4ACC0',

  white: '#FFFFFF',
};

// Gradient pairs — pass straight into <LinearGradient colors={gradients.x}>
export const gradients = {
  hero: ['#0877EA', '#0B67D6'],
  primary: ['#0877EA', '#0B67D6'],
  teal: ['#0F766E', '#14B8A6'],
  amber: ['#B45309', '#F59E0B'],
  rose: ['#BE123C', '#FB7185'],
  sky: ['#0369A1', '#38BDF8'],
  emerald: ['#047857', '#34D399'],
  plum: ['#6D28D9', '#C084FC'],
  ink: ['#123D7A', '#0B67D6'],
  danger: ['#B91C1C', '#EF4444'],
  card: ['#FFFFFF', '#F7F8FE'],
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const type = {
  h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  h2: { fontSize: 20, fontWeight: '800', letterSpacing: -0.2 },
  h3: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 14.5, fontWeight: '500' },
  small: { fontSize: 12.5, fontWeight: '600' },
  tiny: { fontSize: 11, fontWeight: '700' },
};

export const shadow = {
  soft: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  card: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  floating: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Deterministic color-per-name helper so avatars/icons feel varied but
// stay stable across re-renders (no randomness).
const AVATAR_PALETTE = [
  colors.primary,
  colors.teal,
  colors.amber,
  colors.rose,
  colors.sky,
  colors.emerald,
  colors.plum,
  colors.brown,
];

export function colorForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export default { colors, gradients, radius, spacing, type, shadow, colorForName };
