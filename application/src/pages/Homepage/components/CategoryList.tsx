import { PhotoCategory } from "@/src/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CategoryCard } from "./CategoryCard";

interface CategoryListProps {
  categories: PhotoCategory[];
  loading: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  const filteredCategories = categories.filter((category) => {
    // Only show categories with at least 1 photo
    return category.assetCount > 0;
  });

  if (filteredCategories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No categories available</Text>
      </View>
    );
  }

  return (
    <View style={styles.categoriesContainer}>
      {filteredCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    gap: 12,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
