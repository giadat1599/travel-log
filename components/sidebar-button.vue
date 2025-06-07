<script lang="ts" setup>
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="props.showLabel ? undefined : props.label">
    <NuxtLink :to="props.href" :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !props.showLabel, 'justify-start': props.showLabel }" class="flex gap-2 p-2 hover:bg-base-300 cursor-pointer flex-nowrap">
      <Icon :name="props.icon" size="24" />
      <Transition>
        <span v-if="props.showLabel">
          {{ props.label }}
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
