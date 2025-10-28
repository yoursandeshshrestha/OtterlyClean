import { useAppState, useUIState, useGalleryState } from "@/src/store";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionButtons } from "./components/ActionButtons";
import { BackgroundPattern } from "./components/BackgroundPattern";
import { CardStack, CardStackRef } from "./components/CardStack";
import { ImageInfo } from "./components/ImageInfo";
import { ScreenHeader } from "./components/ScreenHeader";

const isInLastNDays = (date: Date, days: number): boolean => {
  const today = new Date();
  const nDaysAgo = new Date(today);
  nDaysAgo.setDate(today.getDate() - days);
  return date >= nDaysAgo && date <= today;
};

const isOnThisDay = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() < today.getFullYear()
  );
};

const isInMonth = (date: Date, month: number, year: number): boolean => {
  return date.getMonth() === month && date.getFullYear() === year;
};

export default function OrganizePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    categoryId: string;
    categoryTitle: string;
  }>();

  // Track the previous category to detect category changes
  const previousCategoryRef = useRef<string | null>(null);

  // Get state from Zustand stores
  const {
    organizePhotos: photos,
    deletedAssets,
    deletedAssetsData,
    lastDeletedImageId,
    processedPhotosCount,
    totalPhotosToProcess,
    organizeCurrentIndex,
    setOrganizePhotos,
    setOrganizeCurrentIndex,
    resetOrganizeProgress,
    undoLastDelete,
    deleteAsset,
    setTotalPhotosToProcess,
    incrementProcessedPhotos,
    resetProcessedPhotos,
  } = useGalleryState();

  // Calculate the actual position in the original photos array
  const actualCurrentIndex = organizeCurrentIndex;

  // Use custom hooks for state management
  const {
    loading,
    setLoading,
    mediaLibraryPermission,
    setMediaLibraryPermission,
  } = useAppState();
  const { showConfirmation, setShowConfirmation } = useUIState();

  const cardStackRef = useRef<CardStackRef>(null);

  const filterPhotosByCategory = (
    assets: MediaLibrary.Asset[],
    categoryId: string
  ): MediaLibrary.Asset[] => {
    if (categoryId === "all-photos") {
      return assets;
    }

    if (categoryId === "random-50") {
      // Shuffle array using Fisher-Yates algorithm and take first 50
      const shuffled = [...assets];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, 50);
    }

    if (categoryId === "recent-7days") {
      return assets.filter((asset) =>
        isInLastNDays(new Date(asset.creationTime), 7)
      );
    }

    if (categoryId === "on-this-day") {
      return assets.filter((asset) =>
        isOnThisDay(new Date(asset.creationTime))
      );
    }

    // Handle monthly categories (format: month-YYYY-M)
    if (categoryId.startsWith("month-")) {
      const [, year, month] = categoryId.split("-");
      return assets.filter((asset) =>
        isInMonth(new Date(asset.creationTime), parseInt(month), parseInt(year))
      );
    }

    return assets;
  };

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setMediaLibraryPermission(status === "granted" ? "granted" : "denied");

        if (status === "granted") {
          const categoryId = params.categoryId || "all-photos";

          // Reset progress only when category changes (not on initial load or return from other screens)
          if (
            previousCategoryRef.current !== null &&
            previousCategoryRef.current !== categoryId
          ) {
            resetOrganizeProgress();
            resetProcessedPhotos();
          }
          previousCategoryRef.current = categoryId;

          const { assets } = await MediaLibrary.getAssetsAsync({
            first: 10000,
            mediaType: ["photo"],
            sortBy: ["creationTime"],
          });

          const filteredPhotos = filterPhotosByCategory(assets, categoryId);
          setOrganizePhotos(filteredPhotos);

          // Set total photos to process for this session
          setTotalPhotosToProcess(filteredPhotos.length);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [
    params.categoryId,
    setMediaLibraryPermission,
    setLoading,
    setOrganizePhotos,
    resetOrganizeProgress,
    setTotalPhotosToProcess,
    resetProcessedPhotos,
  ]);

  // Handle returning from delete page - preserve progress but update state
  useFocusEffect(
    useCallback(() => {
      setShowConfirmation(false);

      // When returning from delete page, we need to ensure the organize state
      // is properly synced with any changes made on the delete page
      // The organizeDeletedImageIds should already be updated by the delete/restore functions
      // but we need to make sure the current index is still valid

      // Filter out deleted images to get visible photos
      const visiblePhotos = photos.filter(
        (photo: MediaLibrary.Asset) => !deletedAssets.includes(photo.id)
      );

      // If current index is beyond the visible photos, adjust it
      if (
        organizeCurrentIndex >= visiblePhotos.length &&
        visiblePhotos.length > 0
      ) {
        // Set to the last available photo
        setOrganizeCurrentIndex(visiblePhotos.length - 1);
      }

      // If all photos have been deleted, reset the organize state
      if (visiblePhotos.length === 0 && photos.length > 0) {
        resetOrganizeProgress();
      }
    }, [
      setShowConfirmation,
      photos,
      deletedAssets,
      organizeCurrentIndex,
      setOrganizeCurrentIndex,
      resetOrganizeProgress,
    ])
  );

  const handleBackPress = () => {
    router.back();
  };

  const handleDeletePress = () => {
    // Deleted images are already synced to main state in handleImageDelete
    // Navigate to delete page to view all deleted images
    router.push("/delete" as any);
  };

  const handleImageDelete = async (imageId: string) => {
    // Find the asset to add to main deleted state
    const asset = photos.find(
      (photo: MediaLibrary.Asset) => photo.id === imageId
    );
    if (asset) {
      deleteAsset(imageId, asset);
    }

    // Increment processed photos count
    incrementProcessedPhotos();

    // Don't increment index - the next photo will move into the current position
    // Check if we've processed all remaining photos
    if (organizeCurrentIndex >= visiblePhotos.length - 1) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => setShowConfirmation(true), 0);
    }
  };

  const handleImageKeep = () => {
    // Increment processed photos count
    incrementProcessedPhotos();

    // Move to next card
    const newIndex = organizeCurrentIndex + 1;
    if (newIndex >= visiblePhotos.length) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => setShowConfirmation(true), 0);
    } else {
      setOrganizeCurrentIndex(newIndex);
    }
  };

  const handleAllCardsProcessed = async () => {
    setShowConfirmation(true);
  };

  const handleUndo = () => {
    if (!lastDeletedImageId) return;
    undoLastDelete();
    // Move back to previous index when undoing
    if (organizeCurrentIndex > 0) {
      setOrganizeCurrentIndex(organizeCurrentIndex - 1);
    }
  };

  const handleConfirmDelete = () => {
    if (deletedAssets.length === 0) return;

    // Deleted images are already synced to store in handleImageDelete

    // Navigate to delete page to view and manage deleted images
    router.push("/delete" as any);
  };

  // Filter out deleted images only
  const visiblePhotos = photos.filter(
    (photo: MediaLibrary.Asset) => !deletedAssets.includes(photo.id)
  );

  const headerTitle = params.categoryTitle || "Organize";

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={headerTitle}
          onBackPress={handleBackPress}
          onDeletePress={handleDeletePress}
          deleteCount={0}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mediaLibraryPermission !== "granted") {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={headerTitle}
          onBackPress={handleBackPress}
          onDeletePress={handleDeletePress}
          deleteCount={0}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Permission Required</Text>
          <Text style={styles.emptySubtext}>
            Please grant photo library access to organize photos
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (photos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={headerTitle}
          onBackPress={handleBackPress}
          onDeletePress={handleDeletePress}
          deleteCount={0}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Photos</Text>
          <Text style={styles.emptySubtext}>
            No photos found in this category
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showConfirmation) {
    if (deletedAssets.length === 0) {
      // No images deleted - show completion message
      return (
        <SafeAreaView style={styles.container}>
          <ScreenHeader
            title={headerTitle}
            onBackPress={handleBackPress}
            deleteCount={0}
          />
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationContent}>
              <Text style={styles.confirmationTitle}>All photos reviewed!</Text>
              <Text style={styles.confirmationSubtitle}>
                You kept all {photos.length} picture
                {photos.length > 1 ? "s" : ""}
              </Text>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={() => router.back()}
              >
                <Text style={styles.confirmDeleteButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    // Images deleted - show delete confirmation
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={headerTitle}
          onBackPress={handleBackPress}
          deleteCount={deletedAssets.length}
        />
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationContent}>
            <Text style={styles.confirmationTitle}>
              You chose to delete {deletedAssets.length} picture
              {deletedAssets.length > 1 ? "s" : ""}
            </Text>
            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={handleConfirmDelete}
            >
              <Text style={styles.confirmDeleteButtonText}>
                Review & Delete
              </Text>
            </TouchableOpacity>
            {lastDeletedImageId && (
              <TouchableOpacity
                style={styles.confirmationUndoButton}
                onPress={handleUndo}
              >
                <Text style={styles.confirmationUndoText}>Undo Last</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackgroundPattern />
        <ScreenHeader
          title={headerTitle}
          onBackPress={handleBackPress}
          onDeletePress={handleDeletePress}
          deleteCount={deletedAssets.length}
        />

        {!showConfirmation && visiblePhotos.length > 0 && (
          <ImageInfo
            currentIndex={actualCurrentIndex}
            totalImages={visiblePhotos.length}
            timestamp={
              visiblePhotos[organizeCurrentIndex]?.creationTime || Date.now()
            }
          />
        )}

        <View style={styles.cardStackContainer}>
          <CardStack
            ref={cardStackRef}
            assets={visiblePhotos}
            currentIndex={organizeCurrentIndex}
            onSwipeLeft={handleImageDelete}
            onSwipeRight={handleImageKeep}
            onAllCardsProcessed={handleAllCardsProcessed}
          />
        </View>

        {!showConfirmation && visiblePhotos.length > 0 && (
          <ActionButtons
            onDelete={() =>
              handleImageDelete(visiblePhotos[organizeCurrentIndex]?.id || "")
            }
            onKeep={handleImageKeep}
            onUndo={handleUndo}
            canUndo={!!lastDeletedImageId}
            onSwipeLeft={() => cardStackRef.current?.swipeLeft()}
            onSwipeRight={() => cardStackRef.current?.swipeRight()}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
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
  emptySubtext: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 130,
    backgroundColor: "#FFFFFF",
  },
  confirmationContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#11181C",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  confirmationSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
  },
  confirmDeleteButton: {
    backgroundColor: "#11181C",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  confirmationUndoButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  confirmationUndoText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "center",
  },
  cardStackContainer: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
  },
});
