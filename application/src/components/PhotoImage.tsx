import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageResizeMode,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface PhotoImageProps {
  asset: MediaLibrary.Asset;
  style: ViewStyle;
  resizeMode?: ImageResizeMode;
}

export const PhotoImage: React.FC<PhotoImageProps> = ({
  asset,
  style,
  resizeMode = "contain",
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadImageUri = async () => {
      if (asset.uri && asset.uri.startsWith("ph://")) {
        try {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
          if (assetInfo.localUri || assetInfo.uri) {
            setImageUri(assetInfo.localUri || assetInfo.uri);
          } else {
            setImageError(true);
          }
        } catch {
          setImageError(true);
        }
      } else {
        setImageUri(asset.uri);
      }
    };
    loadImageUri();
  }, [asset.id, asset.uri]);

  if (imageError) {
    return (
      <View style={[style, styles.placeholderContainer]}>
        <Text style={styles.placeholderText}>📷</Text>
        <Text style={styles.placeholderSubtext}>Unable to load image</Text>
      </View>
    );
  }

  if (!imageUri) {
    return (
      <View style={[style, styles.placeholderContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setImageError(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
