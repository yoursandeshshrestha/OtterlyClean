import { colors, spacing, typography } from "@/src/theme";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeleteButtonProps {
  onPress: () => void;
  count: number;
  disabled?: boolean;
  activeOpacity?: number;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onPress,
  count,
  disabled = false,
  activeOpacity = 0.7,
}) => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onPress}
      disabled={disabled || count === 0}
      activeOpacity={activeOpacity}
    >
      <Trash2
        size={24}
        color={count > 0 ? colors.error : colors.text.tertiary}
      />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
