import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import appReducer from "./slices/appSlice";
import galleryReducer from "./slices/gallerySlice";
import navigationReducer from "./slices/navigationSlice";
import uiReducer from "./slices/uiSlice";

// Enable Immer MapSet plugin for Set and Map support
enableMapSet();

export const store = configureStore({
  reducer: {
    app: appReducer,
    gallery: galleryReducer,
    navigation: navigationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ["ui/setSelectedImages", "ui/setSelectedDeletedImages"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload"],
        // Ignore these paths in the state
        ignoredPaths: ["ui.selectedImages", "ui.selectedDeletedImages"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
