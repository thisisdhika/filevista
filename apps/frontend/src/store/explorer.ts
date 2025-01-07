import { defineStore } from "pinia";
import axiosInstance from "@/lib/axios";

export interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

export interface File {
  id: string;
  name: string;
  size: number;
}

export const useExplorerStore = defineStore("explorer", {
  state: () => ({
    folders: [] as Folder[],
    currentFolder: null as Folder | null,
    files: [] as File[],
  }),
  actions: {
    async loadFolders() {
      try {
        const response = await axiosInstance.get("/api/folders");
        this.folders = response.data;
      } catch (error) {
        console.error("Failed to load folders:", error);
      }
    },
    async loadFolderContents(folderId: string) {
      try {
        const response = await axiosInstance.get(`/api/folders/${folderId}`);
        this.currentFolder = response.data.folder;
        this.files = response.data.files;
      } catch (error) {
        console.error("Failed to load folder contents:", error);
      }
    },
    async createFolder(parentId: string, name: string) {
      try {
        const response = await axiosInstance.post("/api/folders", {
          parentId,
          name,
        });
        if (this.currentFolder?.id === parentId) {
          this.loadFolderContents(parentId); // Refresh current folder
        }
      } catch (error) {
        console.error("Failed to create folder:", error);
      }
    },
    async renameFolder(folderId: string, newName: string) {
      try {
        await axiosInstance.put(`/api/folders/${folderId}`, { name: newName });
        this.loadFolders(); // Refresh folder structure
      } catch (error) {
        console.error("Failed to rename folder:", error);
      }
    },
    async deleteFolder(folderId: string) {
      try {
        await axiosInstance.delete(`/api/folders/${folderId}`);
        if (this.currentFolder?.id === folderId) {
          this.currentFolder = null;
          this.files = [];
        }
        this.loadFolders(); // Refresh folder structure
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
    },
    async deleteFile(fileId: string) {
      try {
        await axiosInstance.delete(`/api/files/${fileId}`);
        if (this.currentFolder) {
          this.loadFolderContents(this.currentFolder.id);
        }
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    },
  },
});
