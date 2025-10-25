import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  // App initialization
  isInitialized: boolean;
  showSplash: boolean;

  // Permissions
  mediaLibraryPermission: "granted" | "denied" | "undetermined";

  // Loading states
  loading: boolean;
  error: string | null;

  // App settings
  theme: "light" | "dark";
  language: string;
}

const initialState: AppState = {
  isInitialized: false,
  showSplash: true,
  mediaLibraryPermission: "undetermined",
  loading: false,
  error: null,
  theme: "light",
  language: "en",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setShowSplash: (state, action: PayloadAction<boolean>) => {
      state.showSplash = action.payload;
    },
    setMediaLibraryPermission: (
      state,
      action: PayloadAction<"granted" | "denied" | "undetermined">
    ) => {
      state.mediaLibraryPermission = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setInitialized,
  setShowSplash,
  setMediaLibraryPermission,
  setLoading,
  setError,
  setTheme,
  setLanguage,
  clearError,
} = appSlice.actions;

export default appSlice.reducer;
