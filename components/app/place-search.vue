<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { NominatimResult } from "~/lib/types";

import { searchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResult = ref<NominatimResult[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

const form = useTemplateRef("form");

async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    hasSearched.value = true;
    errorMessage.value = "";
    searchResult.value = [];
    const result = await $fetch("/api/search", {
      query,
    });
    searchResult.value = result;
    loading.value = false;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResult.value = [];
  errorMessage.value = "";
  hasSearched.value = false;
  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(searchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item" :class="{ 'input-error': errors.q }">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              :disabled="loading"
              placeholder="Search for a location"
            /></label>
          <div v-if="errors.q" class="text-error mt-1 text-xs">
            {{ errors.q }}
          </div>
        </div>
        <button class="btn btn-neutral join-item" :disabled="loading">
          Search
        </button>
      </div>
    </Form>
    <div v-if="errorMessage && !loading" role="alert" class="alert alert-error">
      <span>{{ errorMessage }}</span>
    </div>
    <div v-if="hasSearched && !searchResult.length && !loading" role="alert" class="alert alert-warning">
      <span>No results found</span>
    </div>
    <div v-if="loading" class="flex justify-center mt-2">
      <div class="loading loading-lg" />
    </div>
    <div class="flex flex-col overflow-auto gap-2 max-h-60 mt-2">
      <div v-for="result in searchResult" :key="result.place_id" class="card card-sm bg-base-100">
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
