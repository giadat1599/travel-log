<script setup lang="ts">
const locationStore = useLocationsStore();
const mapStore = useMapStore();
const { locations, status } = storeToRefs(locationStore);

onMounted(() => {
  locationStore.refresh();
});
</script>

<template>
  <div class="p-4 min-h-64">
    <h2 class="text-2xl">
      Locations
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="locations && locations.length > 0" class="flex mt-4 gap-2 overflow-auto">
      <NuxtLink
        v-for="location in locations"
        :key="location.id"
        :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
        class="card border-2 card-compact bg-base-300 h-40 w-72 shrink-0 hover:cursor-pointer mb-2"
        :class="{
          'border-accent': isPointSelected(location, mapStore.selectedPoint),
          'border-transparent': !isPointSelected(location, mapStore.selectedPoint),
        }"
        @mouseenter="mapStore.selectedPoint = createMapPointFromLocation(location)"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h3 class="text-xl">
            {{ location.name }}
          </h3>
          <p>{{ location.description }}</p>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-fit">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
