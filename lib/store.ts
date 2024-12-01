import { create } from "zustand";

interface UploadStore {
  progress: number;
  setProgress: (progress: number) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
  isUploading: false,
  setIsUploading: (isUploading) => set({ isUploading }),
}));