<template>
  <div class="min-h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100
              pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
    <div class="flex-1">
      <RouterView />
    </div>

    <!-- Floating FAB – nur auf Startseite -->
    <div
      v-if="route.name === 'home'"
      class="fixed z-50"
      style="bottom: 20px; right: 30px;"
    >
      <Transition name="fab" mode="out-in">

        <!-- Go-to-Top – ersetzt Settings nach 300px Scroll -->
        <button
          v-if="showScrollTop"
          key="top"
          aria-label="Nach oben scrollen"
          class="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transition-colors"
          @click="scrollToTop"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Settings -->
        <RouterLink
          v-else
          key="settings"
          to="/settings"
          aria-label="Einstellungen"
          class="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transition-colors"
        >
          <template v-if="isLoading">
            <svg class="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-opacity="0.25" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </template>
          <template v-else>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" />
            </svg>
          </template>
        </RouterLink>

      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNewsStore } from '@/stores/newsStore'

const store = useNewsStore()
const route = useRoute()
const showScrollTop = ref(false)
const isLoading = computed(() => store.loading)

function onScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  store.startAutoRefresh()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(8px);
}
</style>

