<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  error?: string;
  label: string;
  name: string;
  type?: "text" | "textarea" | "number";
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      :disabled="disabled"
      :as="type === 'textarea' ? 'textarea' : 'input'"
      :name="name"
      :type="type || 'text'"
      class="w-full"
      :class="{ 'input-error': error, 'input': !type || ['text', 'number'].includes(type), 'textarea': type === 'textarea' }"
    />
    <p v-if="error" class="label" :class="{ 'text-error': error }">
      {{ error }}
    </p>
  </fieldset>
</template>
