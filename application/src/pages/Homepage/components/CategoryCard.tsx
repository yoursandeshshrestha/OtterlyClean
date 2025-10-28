import { colors, spacing, typography } from "@/src/theme";
import { PhotoCategory } from "@/src/types";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CategoryCardProps {
  category: PhotoCategory;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const router = useRouter();

  const getUnitText = (categoryId: string): string => {
    return categoryId === "all-videos" ? "videos" : "photos";
  };

  const handlePress = () => {
    router.push({
      pathname: "/organize" as any,
      params: {
        categoryId: category.id,
        categoryTitle: category.title,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.categoryCard} onPress={handlePress}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <Text style={styles.categoryCount}>
        {category.assetCount} {getUnitText(category.id)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});
