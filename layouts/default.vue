<script lang="ts" setup>
const authStore = useAuthStore();
const mapStore = useMapStore();
await authStore.init();

onMounted(async () => {
  const location = await getCurrentLocation();
  mapStore.currentLocation = [location.longitude, location.latitude];
});
</script>

<template>
  <div class="flex h-screen flex-col">
    <AppNavbar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
