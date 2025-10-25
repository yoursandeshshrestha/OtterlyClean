/**
 * OtterlyClean App Theme
 * Central theme configuration combining colors, typography, and spacing
 */

import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors,
  typography,
  spacing,
} as const;

export type Theme = typeof theme;

// Export individual theme modules
export { colors } from "./colors";
export { spacing } from "./spacing";
export { typography } from "./typography";
