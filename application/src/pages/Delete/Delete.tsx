import { useUIState, useGalleryState } from "@/src/store";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PhotoImage } from "./components/PhotoImage";
import { ScreenHeader } from "./components/ScreenHeader";

export function DeletePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    deletedAssetsData,
    clearDeletedAssets,
    removeDeletedAsset,
    permanentlyDeleteAssets,
    restoreAssets,
  } = useGalleryState();
  const {
    selectedDeletedImages,
    setSelectedDeletedImages,
    addSelectedDeletedImage,
    removeSelectedDeletedImage,
    clearSelectedDeletedImages,
  } = useUIState();

  const handleImagePress = (imageId: string) => {
    if (selectedDeletedImages.has(imageId)) {
      removeSelectedDeletedImage(imageId);
    } else {
      addSelectedDeletedImage(imageId);
    }
  };

  const handleDeleteSelected = () => {
    const count = selectedDeletedImages.size;
    Alert.alert(
      "Delete Photos",
      `Are you sure you want to permanently delete ${count} photo${
        count > 1 ? "s" : ""
      }? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const assetIds = Array.from(selectedDeletedImages);
              const willDeleteAll =
                deletedAssetsData.length === assetIds.length;

              await MediaLibrary.deleteAssetsAsync(assetIds);
              // Remove from state using the new function that syncs organize state
              permanentlyDeleteAssets(assetIds);
              clearSelectedDeletedImages();

              // If all items are deleted, navigate to home
              if (willDeleteAll) {
                router.replace("/(tabs)");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete some images");
            }
          },
        },
      ]
    );
  };

  const handleRestoreSelected = () => {
    const count = selectedDeletedImages.size;
    Alert.alert(
      "Restore Photos",
      `Are you sure you want to restore ${count} photo${count > 1 ? "s" : ""}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Restore",
          onPress: () => {
            // Remove from state using the new function that syncs organize state
            const assetIds = Array.from(selectedDeletedImages);
            const willRestoreAll = deletedAssetsData.length === count;

            restoreAssets(assetIds);
            clearSelectedDeletedImages();

            // If all items are restored, navigate to home
            if (willRestoreAll) {
              router.replace("/(tabs)");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All",
      "Are you sure you want to permanently delete all images? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const assetIds = deletedAssetsData.map((asset) => asset.id);
              await MediaLibrary.deleteAssetsAsync(assetIds);
              // Use clearDeletedAssets which now also clears organize state
              clearDeletedAssets();
              clearSelectedDeletedImages();

              // Navigate to home after deleting all
              router.replace("/(tabs)");
            } catch (error) {
              Alert.alert("Error", "Failed to delete some images");
            }
          },
        },
      ]
    );
  };

  const handleRestoreAll = () => {
    Alert.alert(
      "Restore All",
      "Are you sure you want to restore all deleted images?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Restore All",
          onPress: () => {
            // Use clearDeletedAssets which now also clears organize state
            clearDeletedAssets();
            clearSelectedDeletedImages();

            // Navigate to home after restoring all
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  // Pad array to always show 16 items (4x4 grid)
  const gridData = [...deletedAssetsData];
  while (gridData.length < 16) {
    gridData.push(null as any);
  }

  const renderDeletedAsset = ({
    item,
  }: {
    item: MediaLibrary.Asset | null;
  }) => {
    if (!item) {
      // Empty placeholder cell
      return (
        <View style={styles.gridItem}>
          <View style={styles.imageContainer} />
        </View>
      );
    }

    const isSelected = selectedDeletedImages.has(item.id);

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleImagePress(item.id)}
      >
        <View style={styles.imageContainer}>
          <PhotoImage
            asset={item}
            style={styles.gridImage}
            resizeMode="cover"
          />
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <View style={styles.checkmarkCircle}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Deleted Photos" onBackPress={() => router.back()} />

      {deletedAssetsData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Deleted Photos</Text>
          <Text style={styles.emptySubtitle}>
            Photos you delete will appear here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={gridData}
            renderItem={renderDeletedAsset}
            keyExtractor={(item, index) => item?.id || `placeholder-${index}`}
            numColumns={4}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.row}
          />

          {/* Bottom Action Buttons */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.deleteAllButton}
              onPress={
                selectedDeletedImages.size > 0
                  ? handleDeleteSelected
                  : handleDeleteAll
              }
            >
              <Text style={styles.deleteAllButtonText}>
                {selectedDeletedImages.size > 0
                  ? `Delete selected (${selectedDeletedImages.size})`
                  : "Delete All"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreAllButton}
              onPress={
                selectedDeletedImages.size > 0
                  ? handleRestoreSelected
                  : handleRestoreAll
              }
            >
              <Text style={styles.restoreAllButtonText}>
                {selectedDeletedImages.size > 0
                  ? `Restore selected (${selectedDeletedImages.size})`
                  : "Restore All"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  gridContainer: {
    paddingBottom: 120, // Space for bottom buttons
  },
  row: {
    flexDirection: "row",
    gap: 1,
    marginBottom: 1,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  checkmarkContainer: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#11181C",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomActions: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
    padding: 20,
    alignItems: "center",
  },
  deleteAllButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  deleteAllButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  restoreAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  restoreAllButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "center",
  },
});
