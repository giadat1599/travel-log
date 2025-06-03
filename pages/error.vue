<script lang="ts" setup>
const router = useRoute();
const error = router.query.error || "An unknown error occurred";
</script>

<template>
  <div class="bg-base-300 card container mx-auto mt-4 text-center min-h-72 flex flex-col justify-center items-center gap-4">
    <div role="alert" class="alert alert-error min-w-1/2 text-center">
      <span>Oh no {{ error }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary">
      Home
      <Icon name="tabler:arrow-left" size="32" />
    </NuxtLink>
  </div>
</template>
