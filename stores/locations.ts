import type { MapPoint } from "~/lib/types";

import { createMapPointFromLocation } from "~/utils/map-points";

export const useLocationsStore = defineStore("useLocationsStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      const mapPoints: MapPoint[] = [];
      const sideBarItems: SideBarItem[] = [];

      data.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sideBarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          href: "#",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });

        mapPoints.push(mapPoint);
      });

      sidebarStore.sideBarItems = sideBarItems;

      mapStore.mapPoints = mapPoints;
    }

    sidebarStore.loading = status.value === "pending";
  });

  return {
    locations: data,
    status,
    refresh,
  };
});
