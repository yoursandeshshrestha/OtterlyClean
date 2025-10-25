import { colors, spacing, typography } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MorePage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: 100 + insets.top }]}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Additional features coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.primary,
    padding: spacing.layout.screenPadding,
  },
  title: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
