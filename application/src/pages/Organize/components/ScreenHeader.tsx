import { colors, spacing, typography } from "@/src/theme";
import { ArrowLeft, Trash2, Undo2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  onBackPress: () => void;
  onDeletePress?: () => void;
  onUndoPress?: () => void;
  deleteCount?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBackPress,
  onDeletePress,
  onUndoPress,
  deleteCount = 0,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.safeAreaBackground} />
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ArrowLeft size={24} color={colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.rightButtons}>
        {onUndoPress && (
          <TouchableOpacity style={styles.undoButton} onPress={onUndoPress}>
            <Undo2 size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
        {onDeletePress && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDeletePress}
            disabled={deleteCount === 0}
          >
            <Trash2
              size={24}
              color={deleteCount > 0 ? colors.error : colors.text.tertiary}
            />
            {deleteCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{deleteCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaBackground: {
    position: "absolute",
    top: -100, // Extends above the header
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.md,
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: spacing.sm,
    position: "absolute",
    left: spacing.layout.screenPadding,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    textAlign: "center",
    flex: 1,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: spacing.layout.screenPadding,
    zIndex: 1,
  },
  undoButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  deleteButton: {
    position: "relative",
    padding: spacing.sm,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});
