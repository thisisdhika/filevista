<script setup lang="ts">
// Components
import { Button } from "@/components/ui/button";

const refreshFolders = () => {
  console.log("Refreshing folders...");
};
</script>

<template>
  <div id="app" class="flex flex-col h-screen">
    <navbar class="bg-primary text-primary-foreground shadow">
      <div class="container mx-auto flex items-center justify-between p-4">
        <h1 class="text-xl font-semibold">FileVista</h1>
        <!-- <Button variant="ghost" class="btn" @click="refreshFolders">
          Refresh
        </Button> -->
      </div>
    </navbar>
    <main class="flex-1 bg-secondary text-secondary-foreground">
      <router-view />
    </main>
  </div>
</template>
