<script setup lang="ts">
import type { Folder } from "@/store/explorer";
import { useExplorerStore } from "@/store/explorer";

// Components
import { Button } from "@/components/ui/button";
import { FileList } from "@/components/ui/file-list";
import { FolderTree } from "@/components/ui/folder-tree";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const explorerStore = useExplorerStore();

const createFolder = async (name: string) => {
  if (explorerStore.currentFolder) {
    await explorerStore.createFolder(explorerStore.currentFolder.id, name);
  }
};

const renameCurrentFolder = async () => {
  if (explorerStore.currentFolder) {
    const newName = prompt(
      "Enter new folder name:",
      explorerStore.currentFolder.name
    );
    if (newName) {
      await explorerStore.renameFolder(explorerStore.currentFolder.id, newName);
    }
  }
};

const deleteCurrentFolder = async () => {
  if (explorerStore.currentFolder) {
    if (confirm("Are you sure you want to delete this folder?")) {
      await explorerStore.deleteFolder(explorerStore.currentFolder.id);
    }
  }
};

const handleFolderSelected = ({ id }: Folder) => {
  explorerStore.loadFolderContents(id);
};

explorerStore.loadFolders();
</script>

<template>
  <div class="flex h-full">
    <!-- Left Panel -->
    <aside class="w-1/4 bg-muted text-muted-foreground border-r">
      <Card class="h-full">
        <CardHeader>
          <CardTitle>Folder Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <FolderTree
              :folders="explorerStore.folders"
              @folder-selected="handleFolderSelected"
            />
          </ScrollArea>
        </CardContent>
        <!-- <CardFooter>
          <Button variant="ghost" @click="createFolder('New Folder')">
            New Folder
          </Button>
        </CardFooter> -->
      </Card>
    </aside>

    <!-- Right Panel -->
    <section class="flex-1 bg-card text-card-foreground">
      <Card class="h-full">
        <CardHeader>
          <CardTitle>
            {{ explorerStore.currentFolder?.name || "Files" }}
          </CardTitle>
          <!-- <div>
            <Button variant="ghost" @click="renameCurrentFolder">Rename</Button>
            <Button variant="destructive" @click="deleteCurrentFolder">
              Delete
            </Button>
          </div> -->
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <FileList :files="explorerStore.files" />
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
