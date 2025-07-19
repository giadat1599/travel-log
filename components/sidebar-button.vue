<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="showLabel ? undefined : label">
    <NuxtLink :to="href || to" :class="{ 'bg-base-200': route.path === href, 'justify-center': !showLabel, 'justify-start': showLabel }" class="flex gap-2 p-2 hover:bg-base-300 cursor-pointer flex-nowrap">
      <Icon :name="icon" size="24" :class="iconColor" />
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
