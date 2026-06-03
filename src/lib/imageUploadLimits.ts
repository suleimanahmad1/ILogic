export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = "2 MB";

export const getImageUploadError = (file: File): string | null => {
  if (!file.type.startsWith("image/")) return "Please choose an image file.";
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Image must be ${MAX_IMAGE_SIZE_LABEL} or smaller (this file is ${formatFileSize(file.size)}).`;
  }
  return null;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
