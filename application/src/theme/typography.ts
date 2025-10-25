/**
 * OtterlyClean App Typography
 * Clean, modern typography that complements the otter theme
 */

export const typography = {
  // Font families
  fontFamily: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Font weights
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
    extraBold: "800" as const,
  },

  // Text styles
  textStyles: {
    // Headers
    h1: {
      fontSize: 32,
      fontWeight: "700" as const,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 28,
      fontWeight: "600" as const,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: "600" as const,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 1.4,
    },

    // Body text
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: "400" as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 1.4,
    },

    // Labels and captions
    label: {
      fontSize: 14,
      fontWeight: "500" as const,
      lineHeight: 1.4,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 1.3,
    },

    // Interactive elements
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      lineHeight: 1.2,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: "600" as const,
      lineHeight: 1.2,
    },
    link: {
      fontSize: 16,
      fontWeight: "500" as const,
      lineHeight: 1.4,
    },
  },
} as const;

export type TypographyTheme = typeof typography;
