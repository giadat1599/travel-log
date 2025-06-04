<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div class="bg-base-300 card container mx-auto mt-4 text-center min-h-72 flex flex-col justify-center items-center gap-4">
    <span class="loading loading-spinner loading-xl" />
  </div>
</template>
