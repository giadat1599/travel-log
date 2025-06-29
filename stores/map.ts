import type { LngLatLike } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

import { DEFAULT_CENTER } from "~/lib/constants";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null);
  const currentLocation = ref<LngLatLike>(DEFAULT_CENTER);
  const shouldFlyTo = ref(true);

  function selectPointWithoutFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = !point;
    selectedPoint.value = point;
  }

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");
    const map = useMap();

    // @ts-expect-error it's ok
    let bounds: LngLatBounds | null = null;
    const padding = 60;

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint) {
        return;
      }

      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      map.map?.fitBounds(bounds, {
        padding,
      });
    });

    effect(() => {
      if (addedPoint.value) {
        return;
      }
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          map.map?.flyTo({
            center: [selectedPoint.value?.long, selectedPoint.value?.lat],
            speed: 0.8,
          });
        }
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, {
          padding,
        });
      }
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          speed: 0.8,
          zoom: 6,
        });
      }
    }, { immediate: true });
  }

  return {
    init,
    selectPointWithoutFlyTo,
    mapPoints,
    selectedPoint,
    addedPoint,
    currentLocation,
  };
});
