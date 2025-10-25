/**
 * OtterlyClean App Theme Colors
 * Based on the otter icon's vibrant color palette
 */

export const colors = {
  // Primary colors from the otter icon
  primary: {
    purple: "#6A3ABF", // Background purple
    brown: "#A87C5B", // Otter main fur
    cream: "#F2E8D5", // Otter belly/face
    darkBlue: "#3A2D5C", // Eyes, nose, details
    yellow: "#F7C948", // Broom bristles
    white: "#FFFFFF", // Outline
  },

  // Extended palette for UI components
  background: {
    primary: "#FFFFFF",
    secondary: "#F2E8D5", // Cream
    tertiary: "#F9FAFB",
    purple: "#6A3ABF",
    lightPurple: "#8B5CF6",
  },

  text: {
    primary: "#3A2D5C", // Dark blue
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
    accent: "#6A3ABF", // Purple
  },

  border: {
    light: "#E5E7EB",
    medium: "#D1D5DB",
    dark: "#3A2D5C",
    purple: "#6A3ABF",
  },

  // Status colors
  success: "#10B981",
  warning: "#F7C948", // Yellow from broom
  error: "#EF4444",
  info: "#3B82F6",

  // Interactive states
  interactive: {
    hover: "#8B5CF6", // Light purple
    pressed: "#5B21B6", // Dark purple
    disabled: "#9CA3AF",
  },

  // Card and surface colors
  surface: {
    card: "#FFFFFF",
    cardHover: "#F9FAFB",
    modal: "#FFFFFF",
    overlay: "rgba(58, 45, 92, 0.8)", // Dark blue with opacity
  },

  // Gradient combinations
  gradients: {
    primary: ["#6A3ABF", "#8B5CF6"],
    warm: ["#A87C5B", "#F2E8D5"],
    accent: ["#F7C948", "#F59E0B"],
  },
} as const;

export type ColorTheme = typeof colors;
