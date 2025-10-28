import { DeleteButton } from "@/src/components/DeleteButton";
import { HomeIcon, MoreIcon } from "@/src/components/TabIcons";
import { useGalleryState } from "@/src/store";
import { colors, spacing, typography } from "@/src/theme";
import { Tabs, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { deletedAssetsData } = useGalleryState();

  const handleDeletePress = () => {
    router.push("../delete");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.titleContainerContent}>
              <Image
                source={require("@/assets/images/app-icon-transparent.png")}
                style={styles.appIcon}
              />
              <Text style={styles.title}>OtterlyClean</Text>
            </View>

            <Text style={styles.subtitle}>Organize your gallery with ease</Text>
          </View>
          {deletedAssetsData.length > 0 && (
            <DeleteButton
              onPress={handleDeletePress}
              count={deletedAssetsData.length}
            />
          )}
        </View>
      </View>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            backgroundColor: colors.background.primary,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: spacing.sm,
          },
          tabBarLabelStyle: {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            marginTop: spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: spacing.xs,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color, size }) => (
              <MoreIcon color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  titleContainerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  appIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: "#000000",
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: "left",
  },
});
