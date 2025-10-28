import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as MediaLibrary from "expo-media-library";

export interface PhotoCategory {
  id: string;
  title: string;
  assetCount: number;
  thumbnailUri?: string;
}

export interface GalleryState {
  // Main photo assets
  assets: MediaLibrary.Asset[];
  currentIndex: number;

  // Global deleted assets management (used by both organize and delete pages)
  deletedAssets: string[];
  deletedAssetsData: MediaLibrary.Asset[];
  deletionHistory: { assetId: string; asset: MediaLibrary.Asset }[];
  lastDeletedImageId: string | null;

  // Global photo processing state
  processedPhotosCount: number;
  totalPhotosToProcess: number;

  // Photo categories
  categories: PhotoCategory[];

  // Organize page state
  organizePhotos: MediaLibrary.Asset[];
  organizeCurrentIndex: number;

  // Loading and error states
  loading: boolean;
  error: string | null;
}

interface GalleryActions {
  // Assets management
  setAssets: (assets: MediaLibrary.Asset[]) => void;
  updateAssets: (assets: MediaLibrary.Asset[]) => void;
  setCurrentIndex: (index: number) => void;
  nextAsset: () => void;
  previousAsset: () => void;

  // Global deleted assets management
  deleteAsset: (assetId: string, asset: MediaLibrary.Asset) => void;
  restoreAsset: (assetId: string) => void;
  restoreAssets: (assetIds: string[]) => void;
  clearDeletedAssets: () => void;
  removeDeletedAsset: (assetId: string) => void;
  undoLastDelete: () => void;
  permanentlyDeleteAssets: (assetIds: string[]) => void;

  // Global photo processing management
  setTotalPhotosToProcess: (total: number) => void;
  incrementProcessedPhotos: () => void;
  resetProcessedPhotos: () => void;
  setProcessedPhotosCount: (count: number) => void;

  // Organize page actions
  setOrganizePhotos: (photos: MediaLibrary.Asset[]) => void;
  setOrganizeCurrentIndex: (index: number) => void;
  clearOrganizeState: () => void;
  resetOrganizeProgress: () => void;

  // Categories management
  setCategories: (categories: PhotoCategory[]) => void;

  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type GalleryStore = GalleryState & GalleryActions;

const initialState: GalleryState = {
  assets: [],
  currentIndex: 0,
  deletedAssets: [],
  deletedAssetsData: [],
  deletionHistory: [],
  lastDeletedImageId: null,
  processedPhotosCount: 0,
  totalPhotosToProcess: 0,
  categories: [],
  organizePhotos: [],
  organizeCurrentIndex: 0,
  loading: false,
  error: null,
};

export const useGalleryStore = create<GalleryStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Assets management
      setAssets: (assets) => set({ assets, currentIndex: 0 }),

      updateAssets: (assets) => {
        const state = get();
        const previousAssetId = state.assets[state.currentIndex]?.id;

        // Try to find the same asset in the new array
        let newIndex = 0;
        if (previousAssetId) {
          const foundIndex = assets.findIndex(
            (asset) => asset.id === previousAssetId
          );
          if (foundIndex !== -1) {
            newIndex = foundIndex;
          } else if (state.currentIndex >= assets.length && assets.length > 0) {
            newIndex = assets.length - 1;
          }
        }

        set({ assets, currentIndex: newIndex });
      },

      setCurrentIndex: (index) => set({ currentIndex: index }),

      nextAsset: () => {
        const state = get();
        if (state.currentIndex < state.assets.length - 1) {
          set({ currentIndex: state.currentIndex + 1 });
        }
      },

      previousAsset: () => {
        const state = get();
        if (state.currentIndex > 0) {
          set({ currentIndex: state.currentIndex - 1 });
        }
      },

      // Global deleted assets management
      deleteAsset: (assetId, asset) => {
        const state = get();
        if (!state.deletedAssets.includes(assetId)) {
          set({
            deletedAssets: [...state.deletedAssets, assetId],
            deletedAssetsData: [...state.deletedAssetsData, asset],
            deletionHistory: [...state.deletionHistory, { assetId, asset }],
            lastDeletedImageId: assetId,
            assets: state.assets.filter((a) => a.id !== assetId),
            currentIndex:
              state.currentIndex >= state.assets.length - 1 &&
              state.assets.length > 1
                ? state.assets.length - 2
                : state.currentIndex,
          });
        }
      },

      restoreAsset: (assetId) => {
        const state = get();
        set({
          deletedAssets: state.deletedAssets.filter((id) => id !== assetId),
          deletedAssetsData: state.deletedAssetsData.filter(
            (asset) => asset.id !== assetId
          ),
          deletionHistory: state.deletionHistory.filter(
            (item) => item.assetId !== assetId
          ),
        });
      },

      restoreAssets: (assetIds) => {
        const state = get();
        set({
          deletedAssets: state.deletedAssets.filter(
            (id) => !assetIds.includes(id)
          ),
          deletedAssetsData: state.deletedAssetsData.filter(
            (asset) => !assetIds.includes(asset.id)
          ),
          deletionHistory: state.deletionHistory.filter(
            (item) => !assetIds.includes(item.assetId)
          ),
          // Reset last deleted if it was restored
          lastDeletedImageId: assetIds.includes(state.lastDeletedImageId || "")
            ? null
            : state.lastDeletedImageId,
        });
      },

      clearDeletedAssets: () =>
        set({
          deletedAssets: [],
          deletedAssetsData: [],
          deletionHistory: [],
        }),

      removeDeletedAsset: (assetId) => {
        const state = get();
        set({
          deletedAssets: state.deletedAssets.filter((id) => id !== assetId),
          deletedAssetsData: state.deletedAssetsData.filter(
            (asset) => asset.id !== assetId
          ),
          deletionHistory: state.deletionHistory.filter(
            (item) => item.assetId !== assetId
          ),
        });
      },

      undoLastDelete: () => {
        const state = get();
        const lastDeleted =
          state.deletionHistory[state.deletionHistory.length - 1];
        if (lastDeleted) {
          set({
            deletedAssets: state.deletedAssets.filter(
              (id) => id !== lastDeleted.assetId
            ),
            deletedAssetsData: state.deletedAssetsData.filter(
              (asset) => asset.id !== lastDeleted.assetId
            ),
            deletionHistory: state.deletionHistory.slice(0, -1),
          });
        }
      },

      permanentlyDeleteAssets: (assetIds) => {
        const state = get();
        set({
          deletedAssets: state.deletedAssets.filter(
            (id) => !assetIds.includes(id)
          ),
          deletedAssetsData: state.deletedAssetsData.filter(
            (asset) => !assetIds.includes(asset.id)
          ),
          deletionHistory: state.deletionHistory.filter(
            (item) => !assetIds.includes(item.assetId)
          ),
          // Reset last deleted if it was permanently deleted
          lastDeletedImageId: assetIds.includes(state.lastDeletedImageId || "")
            ? null
            : state.lastDeletedImageId,
        });
      },

      // Organize page actions
      setOrganizePhotos: (photos) => {
        // Preserve current index when updating photos
        set({
          organizePhotos: photos,
          // Don't reset organizeCurrentIndex here
          // It should only be reset by resetOrganizeProgress()
        });
      },

      setOrganizeCurrentIndex: (index) => set({ organizeCurrentIndex: index }),

      clearOrganizeState: () =>
        set({
          organizeCurrentIndex: 0,
        }),

      resetOrganizeProgress: () =>
        set({
          organizeCurrentIndex: 0,
        }),

      // Global photo processing management
      setTotalPhotosToProcess: (total) => set({ totalPhotosToProcess: total }),

      incrementProcessedPhotos: () => {
        const state = get();
        set({ processedPhotosCount: state.processedPhotosCount + 1 });
      },

      resetProcessedPhotos: () =>
        set({ processedPhotosCount: 0, totalPhotosToProcess: 0 }),

      setProcessedPhotosCount: (count) => set({ processedPhotosCount: count }),

      // Categories management
      setCategories: (categories) => set({ categories }),

      // Loading and error states
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: "gallery-store" }
  )
);
