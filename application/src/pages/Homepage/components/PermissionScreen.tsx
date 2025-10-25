import { Camera } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PermissionScreenProps {
  onRequestPermission: () => void;
}

export const PermissionScreen: React.FC<PermissionScreenProps> = ({
  onRequestPermission,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.permissionContainer}>
        <Camera size={48} color="#0a7ea4" />
        <Text style={styles.permissionTitle}>Access Your Photos</Text>
        <Text style={styles.permissionSubtitle}>
          Grant permission to organize your gallery and categorize your photos
        </Text>
        <Pressable
          style={styles.permissionButton}
          onPress={onRequestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Access</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#11181C",
    textAlign: "center",
  },
  permissionSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});