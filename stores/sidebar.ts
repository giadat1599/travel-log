export type SideBarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

export const useSidebarStore = defineStore("useSideBarStore", () => {
  const sideBarItems = ref<SideBarItem[]>([]);
  const loading = ref(false);

  return {
    loading,
    sideBarItems,
  };
});
