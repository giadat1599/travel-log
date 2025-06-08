<script lang="ts" setup>
defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="showLabel ? undefined : label">
    <NuxtLink :to="href" :class="{ 'bg-base-200': route.path === href, 'justify-center': !showLabel, 'justify-start': showLabel }" class="flex gap-2 p-2 hover:bg-base-300 cursor-pointer flex-nowrap">
      <Icon :name="icon" size="24" />
      <Transition>
        <span v-if="showLabel">
          {{ label }}
        </span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
