import type { MapPoint } from "~/lib/types";

export type SideBarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  location?: MapPoint | null;
};

export const useSidebarStore = defineStore("useSideBarStore", () => {
  const sideBarItems = ref<SideBarItem[]>([]);
  const loading = ref(false);

  return {
    loading,
    sideBarItems,
  };
});
