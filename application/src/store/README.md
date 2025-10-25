# Redux State Management

This app uses Redux Toolkit for comprehensive state management across all components.

## Store Structure

The Redux store is organized into four main slices:

### 1. App Slice (`appSlice.ts`)

Manages application-level state:

- **Initialization**: `isInitialized`, `showSplash`
- **Permissions**: `mediaLibraryPermission`
- **Loading States**: `loading`, `error`
- **App Settings**: `theme`, `language`

### 2. Gallery Slice (`gallerySlice.ts`)

Manages photo and gallery-related state:

- **Assets**: `assets`, `currentIndex`
- **Deleted Assets**: `deletedAssets`, `deletedAssetsData`, `deletionHistory`
- **Categories**: `categories`
- **Organize State**: `organizePhotos`, `organizeDeletedImageIds`, `organizeCurrentIndex`
- **View Preferences**: `viewMode`, `sortBy`, `sortOrder`
- **Filter/Search**: `currentFilter`, `searchQuery`

### 3. UI Slice (`uiSlice.ts`)

Manages user interface state:

- **Selected Items**: `selectedImages`, `selectedDeletedImages`
- **Confirmation Dialogs**: `showConfirmation`, `confirmationType`, `confirmationData`
- **Modals**: `showModal`, `modalType`, `modalData`
- **Loading States**: `deletingImages`, `restoringImages`, `organizingImages`
- **Toast Notifications**: `toast`

### 4. Navigation Slice (`navigationSlice.ts`)

Manages navigation state:

- **Current Screen**: `currentScreen`, `previousScreen`
- **Navigation History**: `navigationHistory`
- **Screen Parameters**: `screenParams`
- **Tab Navigation**: `activeTab`
- **Navigation Loading**: `isNavigating`

## Custom Hooks

### `useAppState()`

Provides app-level state management:

```typescript
const {
  loading,
  setLoading,
  mediaLibraryPermission,
  setMediaLibraryPermission,
  showSplash,
  setShowSplash,
} = useAppState();
```

### `useGalleryState()`

Provides gallery state management:

```typescript
const {
  assets,
  setAssets,
  categories,
  setCategories,
  organizePhotos,
  setOrganizePhotos,
  organizeCurrentIndex,
  setOrganizeCurrentIndex,
} = useGalleryState();
```

### `useUIState()`

Provides UI state management:

```typescript
const {
  selectedImages,
  setSelectedImages,
  addSelectedImage,
  removeSelectedImage,
  clearSelectedImages,
  showConfirmationDialog,
  hideConfirmationDialog,
  showToast,
  hideToast,
} = useUIState();
```

### `useNavigationState()`

Provides navigation state management:

```typescript
const {
  currentScreen,
  setCurrentScreen,
  navigateToScreen,
  goBack,
  activeTab,
  setActiveTab,
} = useNavigationState();
```

## Usage Examples

### Managing Selected Images

```typescript
const {
  selectedImages,
  addSelectedImage,
  removeSelectedImage,
  clearSelectedImages,
} = useUIState();

// Add image to selection
addSelectedImage(imageId);

// Remove image from selection
removeSelectedImage(imageId);

// Clear all selections
clearSelectedImages();
```

### Managing Gallery State

```typescript
const {
  organizePhotos,
  setOrganizePhotos,
  organizeCurrentIndex,
  setOrganizeCurrentIndex,
} = useGalleryState();

// Set photos for organize screen
setOrganizePhotos(photos);

// Update current index
setOrganizeCurrentIndex(newIndex);
```

### Managing App State

```typescript
const {
  loading,
  setLoading,
  mediaLibraryPermission,
  setMediaLibraryPermission,
} = useAppState();

// Set loading state
setLoading(true);

// Update permission status
setMediaLibraryPermission("granted");
```

## Benefits

1. **Centralized State**: All app state is managed in one place
2. **Predictable Updates**: State changes follow Redux patterns
3. **Time Travel Debugging**: Redux DevTools support
4. **Type Safety**: Full TypeScript support
5. **Performance**: Optimized re-renders with selectors
6. **Persistence**: Easy to add state persistence
7. **Testing**: Easy to test state logic in isolation

## Migration from Local State

All components have been migrated from local `useState` to Redux state:

- **Before**: `const [loading, setLoading] = useState(false);`
- **After**: `const { loading, setLoading } = useAppState();`

- **Before**: `const [selectedImages, setSelectedImages] = useState(new Set());`
- **After**: `const { selectedImages, setSelectedImages } = useUIState();`

This ensures consistent state management across the entire application.
