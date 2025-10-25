export interface PhotoCategory {
  id: string;
  title: string;
  assetCount: number;
  coverUri?: string;
}

export interface PhotoPermissionStatus {
  status: "granted" | "denied" | "undetermined";
}

export interface PhotoLibrary {
  totalPhotos: number;
  totalVideos: number;
  recentPhotos: number;
  screenshots: number;
  duplicates: number;
}
