import * as MediaLibrary from "expo-media-library";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SwipeableCard, SwipeableCardRef } from "./SwipeableCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface CardStackProps {
  assets: MediaLibrary.Asset[];
  currentIndex: number;
  onSwipeLeft: (assetId: string) => void;
  onSwipeRight: () => void;
  onAllCardsProcessed: () => void;
}

export interface CardStackRef {
  swipeLeft: () => void;
  swipeRight: () => void;
}

export const CardStack = forwardRef<CardStackRef, CardStackProps>(
  function CardStack(
    { assets, currentIndex, onSwipeLeft, onSwipeRight, onAllCardsProcessed },
    ref
  ) {
    const activeCardRef = useRef<SwipeableCardRef>(null);

    // Expose swipe methods to parent
    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        activeCardRef.current?.swipeLeft();
      },
      swipeRight: () => {
        activeCardRef.current?.swipeRight();
      },
    }));

    const handleSwipeLeft = useCallback(
      (assetId: string) => {
        onSwipeLeft(assetId);
      },
      [onSwipeLeft]
    );

    const handleSwipeRight = useCallback(() => {
      onSwipeRight();
    }, [onSwipeRight]);

    // Show up to 3 cards at a time (current + 2 behind)
    const visibleCards = assets.slice(currentIndex, currentIndex + 3);

    if (currentIndex >= assets.length) {
      return null;
    }

    return (
      <View style={styles.container}>
        {visibleCards.map((asset, index) => {
          const isActive = index === 0;

          return (
            <SwipeableCard
              key={asset.id}
              ref={isActive ? activeCardRef : undefined}
              asset={asset}
              index={index}
              totalCards={assets.length}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isActive={isActive}
            />
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
