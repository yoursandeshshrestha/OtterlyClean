import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavigationState {
  // Current screen
  currentScreen: string;
  previousScreen: string | null;

  // Navigation history
  navigationHistory: string[];

  // Screen-specific state
  screenParams: Record<string, any>;

  // Tab navigation
  activeTab: string;

  // Navigation loading
  isNavigating: boolean;
}

const initialState: NavigationState = {
  currentScreen: "home",
  previousScreen: null,
  navigationHistory: ["home"],
  screenParams: {},
  activeTab: "home",
  isNavigating: false,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    // Screen navigation
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.previousScreen = state.currentScreen;
      state.currentScreen = action.payload;

      // Add to history if not already there
      if (!state.navigationHistory.includes(action.payload)) {
        state.navigationHistory.push(action.payload);
      }
    },

    // Navigation with parameters
    navigateToScreen: (
      state,
      action: PayloadAction<{
        screen: string;
        params?: any;
      }>
    ) => {
      state.previousScreen = state.currentScreen;
      state.currentScreen = action.payload.screen;
      state.screenParams[action.payload.screen] = action.payload.params || {};

      // Add to history
      if (!state.navigationHistory.includes(action.payload.screen)) {
        state.navigationHistory.push(action.payload.screen);
      }
    },

    // Go back
    goBack: (state) => {
      if (state.navigationHistory.length > 1) {
        const previousScreen =
          state.navigationHistory[state.navigationHistory.length - 2];
        state.navigationHistory.pop();
        state.previousScreen = state.currentScreen;
        state.currentScreen = previousScreen;
      }
    },

    // Tab navigation
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    // Navigation loading
    setNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },

    // Clear navigation history
    clearNavigationHistory: (state) => {
      state.navigationHistory = [state.currentScreen];
    },

    // Reset navigation state
    resetNavigationState: (state) => {
      state.currentScreen = "home";
      state.previousScreen = null;
      state.navigationHistory = ["home"];
      state.screenParams = {};
      state.activeTab = "home";
      state.isNavigating = false;
    },
  },
});

export const {
  setCurrentScreen,
  navigateToScreen,
  goBack,
  setActiveTab,
  setNavigating,
  clearNavigationHistory,
  resetNavigationState,
} = navigationSlice.actions;

export default navigationSlice.reducer;
