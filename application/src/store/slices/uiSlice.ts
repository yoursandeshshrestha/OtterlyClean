import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  // Selected items across different screens
  selectedImages: Set<string>;
  selectedDeletedImages: Set<string>;

  // Confirmation dialogs
  showConfirmation: boolean;
  confirmationType: "delete" | "restore" | "organize" | null;
  confirmationData: any;

  // Modal states
  showModal: boolean;
  modalType: string | null;
  modalData: any;

  // Loading states for specific operations
  deletingImages: boolean;
  restoringImages: boolean;
  organizingImages: boolean;

  // Toast notifications
  toast: {
    visible: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  };
}

const initialState: UIState = {
  selectedImages: new Set(),
  selectedDeletedImages: new Set(),
  showConfirmation: false,
  confirmationType: null,
  confirmationData: null,
  showModal: false,
  modalType: null,
  modalData: null,
  deletingImages: false,
  restoringImages: false,
  organizingImages: false,
  toast: {
    visible: false,
    message: "",
    type: "info",
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Selected images management
    setSelectedImages: (state, action: PayloadAction<Set<string>>) => {
      state.selectedImages = action.payload;
    },
    addSelectedImage: (state, action: PayloadAction<string>) => {
      state.selectedImages.add(action.payload);
    },
    removeSelectedImage: (state, action: PayloadAction<string>) => {
      state.selectedImages.delete(action.payload);
    },
    clearSelectedImages: (state) => {
      state.selectedImages.clear();
    },

    // Selected deleted images management
    setSelectedDeletedImages: (state, action: PayloadAction<Set<string>>) => {
      state.selectedDeletedImages = action.payload;
    },
    addSelectedDeletedImage: (state, action: PayloadAction<string>) => {
      state.selectedDeletedImages.add(action.payload);
    },
    removeSelectedDeletedImage: (state, action: PayloadAction<string>) => {
      state.selectedDeletedImages.delete(action.payload);
    },
    clearSelectedDeletedImages: (state) => {
      state.selectedDeletedImages.clear();
    },

    // Confirmation dialogs
    setShowConfirmation: (state, action: PayloadAction<boolean>) => {
      state.showConfirmation = action.payload;
    },
    showConfirmationDialog: (
      state,
      action: PayloadAction<{
        type: "delete" | "restore" | "organize";
        data: any;
      }>
    ) => {
      state.showConfirmation = true;
      state.confirmationType = action.payload.type;
      state.confirmationData = action.payload.data;
    },
    hideConfirmationDialog: (state) => {
      state.showConfirmation = false;
      state.confirmationType = null;
      state.confirmationData = null;
    },

    // Modal management
    showModal: (
      state,
      action: PayloadAction<{
        type: string;
        data?: any;
      }>
    ) => {
      state.showModal = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data;
    },
    hideModal: (state) => {
      state.showModal = false;
      state.modalType = null;
      state.modalData = null;
    },

    // Loading states
    setDeletingImages: (state, action: PayloadAction<boolean>) => {
      state.deletingImages = action.payload;
    },
    setRestoringImages: (state, action: PayloadAction<boolean>) => {
      state.restoringImages = action.payload;
    },
    setOrganizingImages: (state, action: PayloadAction<boolean>) => {
      state.organizingImages = action.payload;
    },

    // Toast notifications
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info" | "warning";
      }>
    ) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },

    // Reset UI state
    resetUIState: (state) => {
      state.selectedImages.clear();
      state.selectedDeletedImages.clear();
      state.showConfirmation = false;
      state.confirmationType = null;
      state.confirmationData = null;
      state.showModal = false;
      state.modalType = null;
      state.modalData = null;
      state.deletingImages = false;
      state.restoringImages = false;
      state.organizingImages = false;
      state.toast.visible = false;
    },
  },
});

export const {
  setSelectedImages,
  addSelectedImage,
  removeSelectedImage,
  clearSelectedImages,
  setSelectedDeletedImages,
  addSelectedDeletedImage,
  removeSelectedDeletedImage,
  clearSelectedDeletedImages,
  setShowConfirmation,
  showConfirmationDialog,
  hideConfirmationDialog,
  showModal,
  hideModal,
  setDeletingImages,
  setRestoringImages,
  setOrganizingImages,
  showToast,
  hideToast,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;
