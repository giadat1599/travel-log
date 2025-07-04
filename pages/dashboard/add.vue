<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import type { NominatimResult } from "~/lib/types";

import { InsertLocationSchema } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const mapStore = useMapStore();
const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocationSchema),
  initialValues: {
    name: "",
    description: "",
    lat: (mapStore.currentLocation as [number, number])[1],
    long: (mapStore.currentLocation as [number, number])[0],
  },
});

function formatCoordinate(value?: number) {
  if (!value) {
    return 0;
  }

  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    lat: Number(result.lat),
    long: Number(result.lon),
    centerMap: true,
  };
}

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    lat: (mapStore.currentLocation as [number, number])[1],
    long: (mapStore.currentLocation as [number, number])[0],
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?");
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});
</script>

<template>
  <div class="container max-w-md mx-auto p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit="onSubmit">
      <AppFormField
        name="name"
        label="Name"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormField
        name="description"
        label="Description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <p class="text-sm text-gray-400">
        Current coordinates: {{ formatCoordinate(controlledValues.lat) }}, {{ formatCoordinate(controlledValues.long) }}
      </p>
      <p>To set the coordinates: </p>
      <ul class="list-disc ml-4 text-sm">
        <li>Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> on the map</li>
        <li>Double click on the map</li>
        <li>Search for a location below</li>
      </ul>

      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button :disabled="loading" type="submit" class="btn btn-primary">
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon v-else name="tabler:circle-plus-filled" size="24" />
        </button>
      </div>
    </form>
    <div class="divider" />
    <AppPlaceSearch @result-selected="searchResultSelected" />
  </div>
</template>
