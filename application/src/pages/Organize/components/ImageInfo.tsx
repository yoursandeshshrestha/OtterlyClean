import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ImageInfoProps {
  currentIndex: number;
  totalImages: number;
  timestamp: number;
}

export const ImageInfo: React.FC<ImageInfoProps> = ({
  currentIndex,
  totalImages,
  timestamp,
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  };

  const dateStr = formatDate(timestamp);
  const timeStr = formatTime(timestamp);

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Text style={styles.countText}>
          {currentIndex + 1}/{totalImages}
        </Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.dateText}>{dateStr}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.timeText}>{timeStr}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  countText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flexShrink: 0,
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flexShrink: 0,
    textAlign: "center",
  },
  dot: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    width: 10,
    textAlign: "center",
  },
});
