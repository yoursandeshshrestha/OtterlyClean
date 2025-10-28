import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface AppState {
  // App initialization
  isInitialized: boolean;
  showSplash: boolean;

  // Permissions
  mediaLibraryPermission: "granted" | "denied" | "undetermined";

  // Loading states
  loading: boolean;
  error: string | null;
}

interface AppActions {
  setInitialized: (initialized: boolean) => void;
  setShowSplash: (show: boolean) => void;
  setMediaLibraryPermission: (
    permission: "granted" | "denied" | "undetermined"
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  isInitialized: false,
  showSplash: true,
  mediaLibraryPermission: "undetermined",
  loading: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setShowSplash: (show) => set({ showSplash: show }),
      setMediaLibraryPermission: (permission) =>
        set({ mediaLibraryPermission: permission }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    { name: "app-store" }
  )
);
