import { SplashScreen } from "@/src/components/SplashScreen";
import { useAppState } from "@/src/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppContent() {
  const { showSplash, setShowSplash } = useAppState();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onAnimationComplete={handleSplashComplete} />
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="delete" options={{ headerShown: false }} />
          <Stack.Screen name="organize" options={{ headerShown: false }} />
        </Stack>
      )}
      <StatusBar style={showSplash ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContent />
    </GestureHandlerRootView>
  );
}
