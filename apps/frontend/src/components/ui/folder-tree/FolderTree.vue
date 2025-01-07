<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Folder as FolderClosed, FolderOpen } from "lucide-vue-next";
import type { Folder } from "@/store/explorer";

interface Props {
  folders?: Folder[];
}

defineProps<Props>();

const emit = defineEmits(["folder-selected"]);

const openFolders = ref<Set<string>>(new Set());

const toggle = (folder: Folder) => {
  if (openFolders.value.has(folder.id)) openFolders.value.delete(folder.id);
  else openFolders.value.add(folder.id);

  emit("folder-selected", folder);
};

const isOpen = (folder: Folder) => openFolders.value.has(folder.id);
</script>

<template>
  <ul class="space-y-2">
    <li v-for="folder in folders" :key="folder.id" class="flex flex-col">
      <!-- Folder Name -->
      <Button
        variant="ghost"
        size="sm"
        class="flex items-center justify-start gap-2"
        @click="toggle(folder)"
      >
        <span>
          <FolderOpen v-if="isOpen(folder)" class="w-4 h-4" />
          <FolderClosed v-else class="w-4 h-4" />
        </span>
        <span>{{ folder.name }}</span>
      </Button>

      <div
        v-if="isOpen(folder) && folder.children?.length"
        class="pl-4 border-l border-gray-200 mt-2 space-y-2"
      >
        <FolderTree :folders="folder.children" @folder-selected="toggle" />
      </div>
    </li>
  </ul>
</template>
