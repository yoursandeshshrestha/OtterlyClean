import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as MediaLibrary from "expo-media-library";

export interface GalleryState {
  // Main photo assets
  assets: MediaLibrary.Asset[];
  currentIndex: number;

  // Deleted assets management
  deletedAssets: string[];
  deletedAssetsData: MediaLibrary.Asset[];
  deletionHistory: { assetId: string; asset: MediaLibrary.Asset }[];

  // Photo categories
  categories: PhotoCategory[];

  // Organize page state
  organizePhotos: MediaLibrary.Asset[];
  organizeDeletedImageIds: string[];
  organizeLastDeletedImageId: string | null;
  organizeCurrentIndex: number;

  // Loading and error states
  loading: boolean;
  error: string | null;

  // Filter and search
  currentFilter: string;
  searchQuery: string;

  // View preferences
  viewMode: "grid" | "list";
  sortBy: "creationTime" | "filename" | "size";
  sortOrder: "asc" | "desc";
}

export interface PhotoCategory {
  id: string;
  title: string;
  assetCount: number;
  thumbnailUri?: string;
}

const initialState: GalleryState = {
  assets: [],
  currentIndex: 0,
  deletedAssets: [],
  deletedAssetsData: [],
  deletionHistory: [],
  categories: [],
  organizePhotos: [],
  organizeDeletedImageIds: [],
  organizeLastDeletedImageId: null,
  organizeCurrentIndex: 0,
  loading: false,
  error: null,
  currentFilter: "all-photos",
  searchQuery: "",
  viewMode: "grid",
  sortBy: "creationTime",
  sortOrder: "desc",
};

export const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<MediaLibrary.Asset[]>) => {
      state.assets = action.payload;
      state.currentIndex = 0;
    },
    updateAssets: (state, action: PayloadAction<MediaLibrary.Asset[]>) => {
      // Update assets while preserving the current index position
      const previousAssetId = state.assets[state.currentIndex]?.id;
      state.assets = action.payload;

      // Try to find the same asset in the new array
      if (previousAssetId) {
        const newIndex = state.assets.findIndex(
          (asset) => asset.id === previousAssetId
        );
        if (newIndex !== -1) {
          state.currentIndex = newIndex;
        } else {
          // Asset was deleted, keep the same index or adjust if out of bounds
          if (
            state.currentIndex >= state.assets.length &&
            state.assets.length > 0
          ) {
            state.currentIndex = state.assets.length - 1;
          }
        }
      } else {
        // No previous asset, reset to 0
        state.currentIndex = 0;
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    deleteAsset: (
      state,
      action: PayloadAction<{ assetId: string; asset: MediaLibrary.Asset }>
    ) => {
      const { assetId, asset } = action.payload;
      if (!state.deletedAssets.includes(assetId)) {
        state.deletedAssets.push(assetId);
        state.deletedAssetsData.push(asset);
        // Add to deletion history stack
        state.deletionHistory.push({ assetId, asset });
        // Remove the asset from the assets array
        state.assets = state.assets.filter((asset) => asset.id !== assetId);
        // Adjust current index if needed
        if (
          state.currentIndex >= state.assets.length &&
          state.assets.length > 0
        ) {
          state.currentIndex = state.assets.length - 1;
        }
      }
    },
    restoreAsset: (state, action: PayloadAction<string>) => {
      state.deletedAssets = state.deletedAssets.filter(
        (id) => id !== action.payload
      );
    },
    clearDeletedAssets: (state) => {
      // Clear deleted assets - the category page will reload and show all assets
      state.deletedAssets = [];
      state.deletedAssetsData = [];
      state.deletionHistory = [];
    },
    undoLastDelete: (state) => {
      // Pop the last deleted item from the history
      const lastDeleted = state.deletionHistory.pop();
      if (lastDeleted) {
        const { assetId } = lastDeleted;
        // Remove from deleted lists
        state.deletedAssets = state.deletedAssets.filter(
          (id) => id !== assetId
        );
        state.deletedAssetsData = state.deletedAssetsData.filter(
          (asset) => asset.id !== assetId
        );
      }
    },
    removeDeletedAsset: (state, action: PayloadAction<string>) => {
      const assetId = action.payload;
      // Remove from deleted lists - the category page will reload and show the asset
      state.deletedAssets = state.deletedAssets.filter((id) => id !== assetId);
      state.deletedAssetsData = state.deletedAssetsData.filter(
        (asset) => asset.id !== assetId
      );
      // Also remove from deletion history
      state.deletionHistory = state.deletionHistory.filter(
        (item) => item.assetId !== assetId
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    nextAsset: (state) => {
      if (state.currentIndex < state.assets.length - 1) {
        state.currentIndex += 1;
      }
    },
    previousAsset: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    // Organize page actions
    setOrganizePhotos: (state, action: PayloadAction<MediaLibrary.Asset[]>) => {
      state.organizePhotos = action.payload;
      state.organizeCurrentIndex = 0;
      state.organizeDeletedImageIds = [];
      state.organizeLastDeletedImageId = null;
    },
    setOrganizeCurrentIndex: (state, action: PayloadAction<number>) => {
      state.organizeCurrentIndex = action.payload;
    },
    addOrganizeDeletedImage: (state, action: PayloadAction<string>) => {
      const imageId = action.payload;
      if (!state.organizeDeletedImageIds.includes(imageId)) {
        state.organizeDeletedImageIds.push(imageId);
        state.organizeLastDeletedImageId = imageId;
      }
    },
    removeOrganizeDeletedImage: (state, action: PayloadAction<string>) => {
      const imageId = action.payload;
      state.organizeDeletedImageIds = state.organizeDeletedImageIds.filter(
        (id) => id !== imageId
      );
      if (state.organizeLastDeletedImageId === imageId) {
        state.organizeLastDeletedImageId = null;
      }
    },
    clearOrganizeState: (state) => {
      state.organizeDeletedImageIds = [];
      state.organizeLastDeletedImageId = null;
      state.organizeCurrentIndex = 0;
    },
    undoLastOrganizeDelete: (state) => {
      if (state.organizeLastDeletedImageId) {
        state.organizeDeletedImageIds = state.organizeDeletedImageIds.filter(
          (id) => id !== state.organizeLastDeletedImageId
        );
        state.organizeLastDeletedImageId = null;
      }
    },
    // Categories management
    setCategories: (state, action: PayloadAction<PhotoCategory[]>) => {
      state.categories = action.payload;
    },
    // Filter and search
    setCurrentFilter: (state, action: PayloadAction<string>) => {
      state.currentFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // View preferences
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"creationTime" | "filename" | "size">
    ) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  setAssets,
  updateAssets,
  setCurrentIndex,
  deleteAsset,
  restoreAsset,
  clearDeletedAssets,
  removeDeletedAsset,
  undoLastDelete,
  setLoading,
  setError,
  nextAsset,
  previousAsset,
  // Organize page actions
  setOrganizePhotos,
  setOrganizeCurrentIndex,
  addOrganizeDeletedImage,
  removeOrganizeDeletedImage,
  clearOrganizeState,
  undoLastOrganizeDelete,
  // Categories management
  setCategories,
  // Filter and search
  setCurrentFilter,
  setSearchQuery,
  // View preferences
  setViewMode,
  setSortBy,
  setSortOrder,
} = gallerySlice.actions;

export default gallerySlice.reducer;
