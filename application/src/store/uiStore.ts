import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface UIState {
  // Selected deleted images for delete page
  selectedDeletedImages: Set<string>;

  // Confirmation dialogs
  showConfirmation: boolean;
}

interface UIActions {
  // Selected deleted images management
  setSelectedDeletedImages: (images: Set<string>) => void;
  addSelectedDeletedImage: (imageId: string) => void;
  removeSelectedDeletedImage: (imageId: string) => void;
  clearSelectedDeletedImages: () => void;

  // Confirmation dialogs
  setShowConfirmation: (show: boolean) => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  selectedDeletedImages: new Set(),
  showConfirmation: false,
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Selected deleted images management
      setSelectedDeletedImages: (images) =>
        set({ selectedDeletedImages: images }),

      addSelectedDeletedImage: (imageId) => {
        const state = get();
        const newSet = new Set(state.selectedDeletedImages);
        newSet.add(imageId);
        set({ selectedDeletedImages: newSet });
      },

      removeSelectedDeletedImage: (imageId) => {
        const state = get();
        const newSet = new Set(state.selectedDeletedImages);
        newSet.delete(imageId);
        set({ selectedDeletedImages: newSet });
      },

      clearSelectedDeletedImages: () =>
        set({ selectedDeletedImages: new Set() }),

      // Confirmation dialogs
      setShowConfirmation: (show) => set({ showConfirmation: show }),
    }),
    { name: "ui-store" }
  )
);
