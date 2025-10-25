/**
 * OtterlyClean App Spacing System
 * Consistent spacing based on 4px grid system
 */

export const spacing = {
  // Base spacing units (4px grid)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  64: 256,

  // Semantic spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,

  // Component-specific spacing
  component: {
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    margin: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    gap: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
  },

  // Layout spacing
  layout: {
    screenPadding: 20,
    sectionSpacing: 24,
    cardSpacing: 16,
    listSpacing: 12,
  },
} as const;

export type SpacingTheme = typeof spacing;
