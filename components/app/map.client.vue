<script lang="ts" setup>
import type { LngLatLike } from "maplibre-gl";

const colorMode = useColorMode();
const mapStore = useMapStore();
const center = ref<LngLatLike>([-1.559482, 47.21322]);

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const zoom = 4;

onMounted(async () => {
  if (mapStore.mapPoints.length === 0) {
    const location = await getCurrentLocation();
    center.value = [location.longitude, location.latitude];
  }
  else {
    await mapStore.init();
  }
});
</script>

<template>
  <div class="p-4">
    <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
    >
      <MglNavigationControl />
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div class="tooltip tooltip-top" :data-tip="point.label">
            <Icon name="tabler:map-pin-filled" size="30" class="text-secondary" />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
