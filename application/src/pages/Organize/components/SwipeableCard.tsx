import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import React, { forwardRef, useImperativeHandle } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.5;

interface SwipeableCardProps {
  asset: MediaLibrary.Asset;
  index: number;
  totalCards: number;
  onSwipeLeft: (assetId: string) => void;
  onSwipeRight: () => void;
  isActive: boolean;
}

export interface SwipeableCardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
}

export const SwipeableCard = forwardRef<SwipeableCardRef, SwipeableCardProps>(
  ({ asset, index, totalCards, onSwipeLeft, onSwipeRight, isActive }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    // Calculate z-index and scale based on position
    const zIndex = totalCards - index;
    const cardScale = 1 - index * 0.05; // Each card is slightly smaller
    const cardRotation = index === 0 ? 0 : index % 2 === 0 ? 6 : -6; // First card straight, then alternating rotation

    // Programmatic swipe methods
    const swipeLeft = () => {
      if (!isActive) return;
      translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
      runOnJS(onSwipeLeft)(asset.id);
    };

    const swipeRight = () => {
      if (!isActive) return;
      translateX.value = withSpring(SCREEN_WIDTH * 1.5);
      runOnJS(onSwipeRight)();
    };

    useImperativeHandle(ref, () => ({
      swipeLeft,
      swipeRight,
    }));

    const panGesture = Gesture.Pan()
      .onStart(() => {
        // Store the current position
      })
      .onUpdate((event) => {
        if (!isActive) return;

        translateX.value = event.translationX;
        translateY.value = event.translationY * 0.1; // Slight vertical movement

        // Add rotation based on horizontal movement
        scale.value = interpolate(
          Math.abs(translateX.value),
          [0, SCREEN_WIDTH / 2],
          [1, 0.8]
        );
      })
      .onEnd(() => {
        if (!isActive) return;

        const shouldSwipeLeft = translateX.value < -SCREEN_WIDTH * 0.15;
        const shouldSwipeRight = translateX.value > SCREEN_WIDTH * 0.15;

        if (shouldSwipeLeft) {
          translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
          runOnJS(onSwipeLeft)(asset.id);
        } else if (shouldSwipeRight) {
          translateX.value = withSpring(SCREEN_WIDTH * 1.5);
          runOnJS(onSwipeRight)();
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          scale.value = withSpring(1);
        }
      });

    const animatedStyle = useAnimatedStyle(() => {
      const rotation = interpolate(
        translateX.value,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [-30, 0, 30]
      );

      const opacity = interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH * 0.3],
        [1, 0.5]
      );

      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: scale.value * cardScale },
          { rotate: `${rotation + cardRotation}deg` },
        ],
        opacity: isActive ? opacity : 0.7,
      };
    });

    // Overlay animations for red (left swipe) and green (right swipe)
    const redOverlayOpacity = useDerivedValue(() => {
      return interpolate(
        translateX.value,
        [-SCREEN_WIDTH * 0.3, -SCREEN_WIDTH * 0.1, 0],
        [0.7, 0.3, 0]
      );
    });

    const greenOverlayOpacity = useDerivedValue(() => {
      return interpolate(
        translateX.value,
        [0, SCREEN_WIDTH * 0.1, SCREEN_WIDTH * 0.3],
        [0, 0.3, 0.7]
      );
    });

    const redOverlayStyle = useAnimatedStyle(() => ({
      opacity: redOverlayOpacity.value,
    }));

    const greenOverlayStyle = useAnimatedStyle(() => ({
      opacity: greenOverlayOpacity.value,
    }));

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.card,
            {
              zIndex,
              transform: [
                { scale: cardScale },
                { rotate: `${cardRotation}deg` },
              ],
            },
            animatedStyle,
          ]}
        >
          <Image
            source={{ uri: asset.uri }}
            style={styles.image}
            contentFit="cover"
          />

          {/* Color overlays - only show on active card */}
          {isActive && (
            <>
              <Animated.View
                style={[
                  styles.colorOverlay,
                  styles.redOverlay,
                  redOverlayStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.colorOverlay,
                  styles.greenOverlay,
                  greenOverlayStyle,
                ]}
              />
            </>
          )}
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  colorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  redOverlay: {
    backgroundColor: "rgba(239, 68, 68, 0.4)",
  },
  greenOverlay: {
    backgroundColor: "rgba(16, 185, 129, 0.4)",
  },
});
