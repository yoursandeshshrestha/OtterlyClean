import { PhotoCategory } from "@/src/types";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

// Helper functions for date filtering
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isOnThisDay = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() < today.getFullYear()
  );
};

const isInLastNDays = (date: Date, days: number): boolean => {
  const today = new Date();
  const nDaysAgo = new Date(today);
  nDaysAgo.setDate(today.getDate() - days);
  return date >= nDaysAgo && date <= today;
};

const isInMonth = (date: Date, month: number, year: number): boolean => {
  return date.getMonth() === month && date.getFullYear() === year;
};

const getMonthName = (monthIndex: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};

// Helper to create a category object
const createCategory = (
  id: string,
  title: string,
  count: number
): PhotoCategory => ({
  id,
  title,
  assetCount: count,
});

// Helper to filter assets by date predicate
const filterAssetsByDate = (
  assets: MediaLibrary.Asset[],
  predicate: (date: Date) => boolean
): number => {
  return assets.filter((asset) => predicate(new Date(asset.creationTime)))
    .length;
};

export const usePhotos = () => {
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [categories, setCategories] = useState<PhotoCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setPermissionStatus(status === "granted" ? "granted" : "denied");
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      // Fetch all photos
      const { assets: allPhotos } = await MediaLibrary.getAssetsAsync({
        first: 10000,
        mediaType: ["photo"],
      });

      const photoCategories: PhotoCategory[] = [];

      // Main categories
      photoCategories.push(
        createCategory("all-photos", "All Photos", allPhotos.length)
      );

      // Recent categories
      const last7DaysCount = filterAssetsByDate(allPhotos, (date) =>
        isInLastNDays(date, 7)
      );
      if (last7DaysCount > 0) {
        photoCategories.push(
          createCategory("recent-7days", "Recent (Last 7 Days)", last7DaysCount)
        );
      }

      // On this day (same date from previous years)
      const onThisDayCount = filterAssetsByDate(allPhotos, isOnThisDay);
      if (onThisDayCount > 0) {
        photoCategories.push(
          createCategory("on-this-day", "On This Day", onThisDayCount)
        );
      }

      // Random category
      const randomCount = Math.min(50, allPhotos.length);
      if (randomCount > 0) {
        photoCategories.push(
          createCategory("random-50", "Random 50", randomCount)
        );
      }

      // Monthly categories (current month and backward up to 24 months)
      const today = new Date();
      const monthsToShow = 24;

      for (let i = 0; i < monthsToShow; i++) {
        const targetDate = new Date(
          today.getFullYear(),
          today.getMonth() - i,
          1
        );
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();

        const monthCount = filterAssetsByDate(allPhotos, (date) =>
          isInMonth(date, month, year)
        );

        if (monthCount > 0) {
          const monthName = getMonthName(month);
          photoCategories.push(
            createCategory(
              `month-${year}-${month}`,
              `${monthName} ${year}`,
              monthCount
            )
          );
        }
      }

      setCategories(photoCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await MediaLibrary.getPermissionsAsync();
      setPermissionStatus(status === "granted" ? "granted" : "denied");

      if (status === "granted") {
        await fetchCategories();
      } else {
        setLoading(false);
      }
    };

    checkPermission();
  }, []);

  return {
    permissionStatus,
    categories,
    loading,
    requestPermission,
  };
};
