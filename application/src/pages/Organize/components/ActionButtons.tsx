import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { Heart, Trash2, Undo2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onDelete: () => void;
  onKeep: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDelete,
  onKeep,
  onUndo,
  canUndo,
  onSwipeLeft,
  onSwipeRight,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.safeAreaBackground} />
      <TouchableOpacity
        style={[styles.button, styles.undoButton]}
        onPress={onUndo}
        disabled={!canUndo}
      >
        <Undo2
          size={20}
          color={canUndo ? colors.text.tertiary : colors.interactive.disabled}
        />
        <Text
          style={[
            styles.buttonText,
            styles.undoButtonText,
            !canUndo && styles.disabledText,
          ]}
        >
          Undo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.keepButton]}
        onPress={() => {
          onSwipeRight();
          onKeep();
        }}
      >
        <Heart size={20} color={colors.success} />
        <Text style={[styles.buttonText, styles.keepButtonText]}>Keep</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={() => {
          onSwipeLeft();
          onDelete();
        }}
      >
        <Trash2 size={20} color={colors.error} />
        <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaBackground: {
    position: "absolute",
    bottom: -100, // Extends below the buttons
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.lg,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 50,
    minWidth: 80,
    gap: spacing.sm,
  },
  undoButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  keepButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.success,
  },
  deleteButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.error,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  undoButtonText: {
    color: colors.text.tertiary,
  },
  keepButtonText: {
    color: colors.success,
  },
  deleteButtonText: {
    color: colors.error,
  },
  disabledText: {
    color: colors.interactive.disabled,
  },
});
