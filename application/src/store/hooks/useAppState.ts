import * as MediaLibrary from "expo-media-library";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

// App state hooks
export const useAppState = () => {
  const dispatch = useAppDispatch();
  const appState = useAppSelector((state) => state.app);

  const setInitialized = useCallback(
    (initialized: boolean) => {
      dispatch({ type: "app/setInitialized", payload: initialized });
    },
    [dispatch]
  );

  const setShowSplash = useCallback(
    (show: boolean) => {
      dispatch({ type: "app/setShowSplash", payload: show });
    },
    [dispatch]
  );

  const setMediaLibraryPermission = useCallback(
    (permission: "granted" | "denied" | "undetermined") => {
      dispatch({ type: "app/setMediaLibraryPermission", payload: permission });
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: "app/setLoading", payload: loading });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: "app/setError", payload: error });
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch({ type: "app/clearError" });
  }, [dispatch]);

  return {
    ...appState,
    setInitialized,
    setShowSplash,
    setMediaLibraryPermission,
    setLoading,
    setError,
    clearError,
  };
};

// Gallery state hooks
export const useGalleryState = () => {
  const dispatch = useAppDispatch();
  const galleryState = useAppSelector((state) => state.gallery);

  const setAssets = useCallback(
    (assets: MediaLibrary.Asset[]) => {
      dispatch({ type: "gallery/setAssets", payload: assets });
    },
    [dispatch]
  );

  const setCategories = useCallback(
    (categories: any[]) => {
      dispatch({ type: "gallery/setCategories", payload: categories });
    },
    [dispatch]
  );

  const setCurrentIndex = useCallback(
    (index: number) => {
      dispatch({ type: "gallery/setCurrentIndex", payload: index });
    },
    [dispatch]
  );

  const setOrganizePhotos = useCallback(
    (photos: MediaLibrary.Asset[]) => {
      dispatch({ type: "gallery/setOrganizePhotos", payload: photos });
    },
    [dispatch]
  );

  const setOrganizeCurrentIndex = useCallback(
    (index: number) => {
      dispatch({ type: "gallery/setOrganizeCurrentIndex", payload: index });
    },
    [dispatch]
  );

  const addOrganizeDeletedImage = useCallback(
    (imageId: string) => {
      dispatch({ type: "gallery/addOrganizeDeletedImage", payload: imageId });
    },
    [dispatch]
  );

  const clearOrganizeState = useCallback(() => {
    dispatch({ type: "gallery/clearOrganizeState" });
  }, [dispatch]);

  const undoLastOrganizeDelete = useCallback(() => {
    dispatch({ type: "gallery/undoLastOrganizeDelete" });
  }, [dispatch]);

  const deleteAsset = useCallback(
    (assetId: string, asset: MediaLibrary.Asset) => {
      dispatch({ type: "gallery/deleteAsset", payload: { assetId, asset } });
    },
    [dispatch]
  );

  const removeDeletedAsset = useCallback(
    (assetId: string) => {
      dispatch({ type: "gallery/removeDeletedAsset", payload: assetId });
    },
    [dispatch]
  );

  const clearDeletedAssets = useCallback(() => {
    dispatch({ type: "gallery/clearDeletedAssets" });
  }, [dispatch]);

  return {
    ...galleryState,
    setAssets,
    setCategories,
    setCurrentIndex,
    setOrganizePhotos,
    setOrganizeCurrentIndex,
    addOrganizeDeletedImage,
    clearOrganizeState,
    undoLastOrganizeDelete,
    deleteAsset,
    removeDeletedAsset,
    clearDeletedAssets,
  };
};

// UI state hooks
export const useUIState = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.ui);

  const setSelectedImages = useCallback(
    (selectedImages: Set<string>) => {
      dispatch({ type: "ui/setSelectedImages", payload: selectedImages });
    },
    [dispatch]
  );

  const addSelectedImage = useCallback(
    (imageId: string) => {
      dispatch({ type: "ui/addSelectedImage", payload: imageId });
    },
    [dispatch]
  );

  const removeSelectedImage = useCallback(
    (imageId: string) => {
      dispatch({ type: "ui/removeSelectedImage", payload: imageId });
    },
    [dispatch]
  );

  const clearSelectedImages = useCallback(() => {
    dispatch({ type: "ui/clearSelectedImages" });
  }, [dispatch]);

  const setSelectedDeletedImages = useCallback(
    (selectedImages: Set<string>) => {
      dispatch({
        type: "ui/setSelectedDeletedImages",
        payload: selectedImages,
      });
    },
    [dispatch]
  );

  const addSelectedDeletedImage = useCallback(
    (imageId: string) => {
      dispatch({ type: "ui/addSelectedDeletedImage", payload: imageId });
    },
    [dispatch]
  );

  const removeSelectedDeletedImage = useCallback(
    (imageId: string) => {
      dispatch({ type: "ui/removeSelectedDeletedImage", payload: imageId });
    },
    [dispatch]
  );

  const clearSelectedDeletedImages = useCallback(() => {
    dispatch({ type: "ui/clearSelectedDeletedImages" });
  }, [dispatch]);

  const showConfirmationDialog = useCallback(
    (type: "delete" | "restore" | "organize", data: any) => {
      dispatch({ type: "ui/showConfirmationDialog", payload: { type, data } });
    },
    [dispatch]
  );

  const hideConfirmationDialog = useCallback(() => {
    dispatch({ type: "ui/hideConfirmationDialog" });
  }, [dispatch]);

  const setShowConfirmation = useCallback(
    (show: boolean) => {
      dispatch({ type: "ui/setShowConfirmation", payload: show });
    },
    [dispatch]
  );

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning") => {
      dispatch({ type: "ui/showToast", payload: { message, type } });
    },
    [dispatch]
  );

  const hideToast = useCallback(() => {
    dispatch({ type: "ui/hideToast" });
  }, [dispatch]);

  return {
    ...uiState,
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
    showToast,
    hideToast,
  };
};

// Navigation state hooks
export const useNavigationState = () => {
  const dispatch = useAppDispatch();
  const navigationState = useAppSelector((state) => state.navigation);

  const setCurrentScreen = useCallback(
    (screen: string) => {
      dispatch({ type: "navigation/setCurrentScreen", payload: screen });
    },
    [dispatch]
  );

  const navigateToScreen = useCallback(
    (screen: string, params?: any) => {
      dispatch({
        type: "navigation/navigateToScreen",
        payload: { screen, params },
      });
    },
    [dispatch]
  );

  const goBack = useCallback(() => {
    dispatch({ type: "navigation/goBack" });
  }, [dispatch]);

  const setActiveTab = useCallback(
    (tab: string) => {
      dispatch({ type: "navigation/setActiveTab", payload: tab });
    },
    [dispatch]
  );

  return {
    ...navigationState,
    setCurrentScreen,
    navigateToScreen,
    goBack,
    setActiveTab,
  };
};
