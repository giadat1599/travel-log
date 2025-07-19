<script lang="ts" setup>
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const zoom = 4;

function updateAddedPoint(location: LngLat) {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    lat: location.lat,
    long: location.lng,
  };
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
}

onMounted(async () => {
  await mapStore.init();
});
</script>

<template>
  <div class="p-4">
    <MglMap
      :map-style="style"
      :center="mapStore.currentLocation"
      :zoom="zoom"
      @map:dblclick="onDoubleClick"
    >
      <MglNavigationControl />
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top hover:cursor-pointer"
            :class="{
              'tooltip-open': isPointSelected(point, mapStore.selectedPoint),
            }"
            :data-tip="point.name"
            @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
            @mouseleave="mapStore.selectPointWithoutFlyTo(null)"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="isPointSelected(point, mapStore.selectedPoint) ? 'text-accent' : 'text-secondary'"
            />
          </div>
        </template>
        <MglPopup>
          <h3 class="text-xl">
            {{ point.name }}
          </h3>
          <p v-if="point.description">
            {{ point.description }}
          </p>
          <div class="flex justify-end mt-4">
            <NuxtLink v-if="point.to" :to="point.to" class="btn btn-outline">
              {{ point.toLabel }}
            </NuxtLink>
          </div>
        </MglPopup>
      </MglMarker>
      <MglMarker
        v-if="mapStore.addedPoint"
        draggable
        class-name="z-50"
        :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
        @update:coordinates="updateAddedPoint"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top hover:cursor-pointer tooltip-open"
            data-tip="Drag to your desire location"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="text-warning"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
