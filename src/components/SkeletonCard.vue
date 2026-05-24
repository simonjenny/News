<template>
  <article class="flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
    <!-- Image area -->
    <div class="aspect-video animate-shimmer" />

    <!-- Body -->
    <div class="flex flex-col flex-1 gap-2 p-4">
      <!-- Badge + Date row -->
      <div class="flex items-center gap-2">
        <div class="h-4 w-1/3 rounded-full animate-shimmer" />
        <div class="h-3 w-14 rounded animate-shimmer ml-auto" />
      </div>
      <!-- Title lines -->
      <div class="h-4 w-full rounded animate-shimmer" />
      <div class="h-4 w-4/5 rounded animate-shimmer" />
      <div class="h-4 w-3/5 rounded animate-shimmer" />
      <!-- Summary lines -->
      <div class="h-3 w-full rounded animate-shimmer mt-1" />
      <div class="h-3 w-5/6 rounded animate-shimmer" />
      <div class="h-3 w-4/6 rounded animate-shimmer" />
    </div>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
      <div class="h-4 w-14 rounded animate-shimmer" />
      <div class="h-5 w-5 rounded-full animate-shimmer" />
    </div>
  </article>
</template>

<script setup lang="ts">
// Keine Props, keine Logik
</script>
