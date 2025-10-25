import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const BackgroundPattern: React.FC = () => {
  // Create a repeating pattern by rendering multiple SVG elements
  const patternSize = 32;
  const cols = Math.ceil(SCREEN_WIDTH / patternSize);
  const rows = Math.ceil(SCREEN_HEIGHT / patternSize);

  return (
    <View style={styles.container}>
      {Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => (
          <Svg
            key={`${rowIndex}-${colIndex}`}
            width={patternSize}
            height={patternSize}
            viewBox="0 0 32 32"
            fill="none"
            style={[
              styles.patternTile,
              {
                left: colIndex * patternSize,
                top: rowIndex * patternSize,
              },
            ]}
          >
            <Path d="M0 .5H31.5V32" stroke="#d4d4d4" strokeWidth="2" />
          </Svg>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f8f9fa",
  },
  patternTile: {
    position: "absolute",
  },
});
