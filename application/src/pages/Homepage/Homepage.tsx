import { usePhotos } from "@/src/hooks/use-photos";
import { useAppState, useGalleryState } from "@/src/store/hooks/useAppState";
import { colors, spacing } from "@/src/theme";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryList } from "./components/CategoryList";
import { PermissionScreen } from "./components/PermissionScreen";

export function Homepage() {
  const insets = useSafeAreaInsets();
  const { permissionStatus, categories, loading, requestPermission } =
    usePhotos();

  // Use Redux state for app-level state
  const { mediaLibraryPermission } = useAppState();
  const { categories: reduxCategories, setCategories } = useGalleryState();

  if (permissionStatus === "undetermined" || permissionStatus === "denied") {
    return <PermissionScreen onRequestPermission={requestPermission} />;
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: 80 + insets.top }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <CategoryList categories={categories} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: spacing.layout.screenPadding,
    paddingBottom: 100,
  },
});
