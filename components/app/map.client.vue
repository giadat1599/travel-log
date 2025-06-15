<script lang="ts" setup>
const colorMode = useColorMode();
const center = ref<[number, number]>([-1.559482, 47.21322]);

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const zoom = 4;

onMounted(async () => {
  const location = await getCurrentLocation();
  if (location) {
    center.value = [location.longitude, location.latitude];
  }
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
