<script setup lang="ts">
import { File as FileIcon } from "lucide-vue-next";
import type { File, Folder } from "@/store/explorer";

interface Props {
  currentFolder?: Folder | null;
  files: File[];
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="file in files"
      :key="file.id"
      class="flex justify-between items-center p-2 rounded-md hover:bg-accent/80 cursor-pointer"
    >
      <div class="flex gap-[1ch] items-center">
        <FileIcon class="w-4 h-4" />
        <span>{{ file.name }}</span>
      </div>
      <span class="text-sm text-muted-foreground">{{ file.size }} KB</span>
    </div>
  </div>
</template>
