<template>
  <Transition name="update-banner">
    <div
      v-if="needRefresh"
      class="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-between gap-3 px-4 bg-indigo-600 text-white shadow-2xl"
      style="padding-top: 0.75rem; padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="shrink-0">
          <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span class="text-sm font-medium leading-snug">Neue Version verfügbar.</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button
          class="px-4 py-1.5 bg-white text-indigo-600 rounded-lg text-sm font-semibold cursor-pointer border-none transition-colors hover:bg-indigo-50"
          @click="update"
        >
          Aktualisieren
        </button>
        <button
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 cursor-pointer border-none text-white hover:bg-white/30 transition-colors"
          aria-label="Schliessen"
          @click="dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()

function update() {
  updateServiceWorker(true)
}

function dismiss() {
  needRefresh.value = false
}
</script>

<style scoped>
.update-banner-enter-active,
.update-banner-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.update-banner-enter-from,
.update-banner-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
