// Import stores for internal use
import { useAppStore } from "./appStore";
import { useGalleryStore } from "./galleryStore";
import { useUIStore } from "./uiStore";

// Export all stores
export { useAppStore } from "./appStore";
export { useGalleryStore } from "./galleryStore";
export { useUIStore } from "./uiStore";

// Re-export types for convenience
export type { AppState } from "./appStore";
export type { GalleryState, PhotoCategory } from "./galleryStore";
export type { UIState } from "./uiStore";

// Convenience hooks that match the old Redux patterns
export const useAppState = () => {
  const store = useAppStore();
  return {
    // State
    isInitialized: store.isInitialized,
    showSplash: store.showSplash,
    mediaLibraryPermission: store.mediaLibraryPermission,
    loading: store.loading,
    error: store.error,

    // Actions
    setInitialized: store.setInitialized,
    setShowSplash: store.setShowSplash,
    setMediaLibraryPermission: store.setMediaLibraryPermission,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
  };
};

export const useGalleryState = () => {
  const store = useGalleryStore();
  return {
    // State
    assets: store.assets,
    currentIndex: store.currentIndex,
    deletedAssets: store.deletedAssets,
    deletedAssetsData: store.deletedAssetsData,
    deletionHistory: store.deletionHistory,
    lastDeletedImageId: store.lastDeletedImageId,
    processedPhotosCount: store.processedPhotosCount,
    totalPhotosToProcess: store.totalPhotosToProcess,
    categories: store.categories,
    organizePhotos: store.organizePhotos,
    organizeCurrentIndex: store.organizeCurrentIndex,
    loading: store.loading,
    error: store.error,

    // Actions
    setAssets: store.setAssets,
    updateAssets: store.updateAssets,
    setCurrentIndex: store.setCurrentIndex,
    deleteAsset: store.deleteAsset,
    restoreAsset: store.restoreAsset,
    restoreAssets: store.restoreAssets,
    permanentlyDeleteAssets: store.permanentlyDeleteAssets,
    clearDeletedAssets: store.clearDeletedAssets,
    removeDeletedAsset: store.removeDeletedAsset,
    undoLastDelete: store.undoLastDelete,
    nextAsset: store.nextAsset,
    previousAsset: store.previousAsset,
    setOrganizePhotos: store.setOrganizePhotos,
    setOrganizeCurrentIndex: store.setOrganizeCurrentIndex,
    clearOrganizeState: store.clearOrganizeState,
    resetOrganizeProgress: store.resetOrganizeProgress,
    setTotalPhotosToProcess: store.setTotalPhotosToProcess,
    incrementProcessedPhotos: store.incrementProcessedPhotos,
    resetProcessedPhotos: store.resetProcessedPhotos,
    setProcessedPhotosCount: store.setProcessedPhotosCount,
    setCategories: store.setCategories,
    setLoading: store.setLoading,
    setError: store.setError,
  };
};

export const useUIState = () => {
  const store = useUIStore();
  return {
    // State
    selectedDeletedImages: store.selectedDeletedImages,
    showConfirmation: store.showConfirmation,

    // Actions
    setSelectedDeletedImages: store.setSelectedDeletedImages,
    addSelectedDeletedImage: store.addSelectedDeletedImage,
    removeSelectedDeletedImage: store.removeSelectedDeletedImage,
    clearSelectedDeletedImages: store.clearSelectedDeletedImages,
    setShowConfirmation: store.setShowConfirmation,
  };
};
