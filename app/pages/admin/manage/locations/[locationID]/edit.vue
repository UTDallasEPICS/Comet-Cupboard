<template>
  <UContainer class="py-8">
    <header>
      <SharedButtonNavigateBack
        text="Back to Manage Locations"
        :to="{ path: '/admin/manage/locations' }"
      />
      <SharedTextPageTitle>Manage Locations</SharedTextPageTitle>
    </header>

    <section class="mt-4">
      <SharedTextSectionTitle>
        Edit {{ currentLocation?.name }} Location
      </SharedTextSectionTitle>

      <div class="mx-auto w-min">
        <UForm
          :validate="validate"
          :state="state"
          class="w-96 space-y-4"
          @submit="onSubmit"
          @error="onError"
        >
          <UFormField id="name" name="name" label="Location Name">
            <UInput v-model="state.name" placeholder="Enter location name" />
          </UFormField>

          <UFormField id="address" name="address" label="Address">
            <UInput v-model="state.address" placeholder="Enter address" />
          </UFormField>

          <UCard :ui="{ header: 'p-2', body: 'p-2' }">
            <template #header>
              <SharedTextBase>Existing Locations with Similar Names</SharedTextBase>
            </template>
            <template #default>
              <ul class="space-y-1">
                <li v-for="item in mostSimilarItems" :key="item.name">
                  <SharedTextBase>{{ item.name }}</SharedTextBase>
                </li>
              </ul>
            </template>
          </UCard>

          <UFormField id="archived" name="archived" label="Archived">
            <UCheckbox v-model="state.archived" />
          </UFormField>

          <footer class="flex justify-end mt-4">
            <SharedButtonPositiveAction type="submit" text="Submit" />
          </footer>
        </UForm>
      </div>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
import * as z from "zod"

// get route param
const route = useRoute()
const locationName = (route.params.name || route.params.locationID) as string
if (!locationName) throw new Error("Location name not found in route")

// fetch all locations including archived
const { data: locations } = await useFetch("/api/public/location/locations", {
  query: { includeArchived: true },
})

// find the current location
const currentLocation = computed(() =>
  locations.value?.find((l) => l.name === locationName)
)

// form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Location name cannot be empty").optional(),
  address: z.string().min(1, "Address cannot be empty").optional(),
  archived: z.boolean().optional(),
})

// build form
const { state, validate, onError } = createFormBuilder(formSchema, () => ({
  name: currentLocation.value?.name,
  address: currentLocation.value?.address,
  archived: currentLocation.value?.archived ?? false,
}))

// fuzzy search for similar names
const { query, filtered } = useFuzzySearch(locations ?? ref([]), {
  searchKeys: ["name"],
})

watch(
  () => state.value.name,
  (val) => (query.value = val || ""),
  { immediate: true }
)

const mostSimilarItems = computed(() => filtered.value.slice(0, 5))

// submit function
const onSubmit = async () => {
  const payload: any = {
    originalName: locationName,
  }

  // only include non-empty updates
  if (state.value.name?.trim()) payload.name = state.value.name.trim()
  if (state.value.address?.trim()) payload.address = state.value.address.trim()
  if (state.value.archived !== undefined) payload.archived = !!state.value.archived

  // sanity check: at least one field must be updated
  if (!payload.name && !payload.address && payload.archived === undefined) {
    console.error("Nothing to update")
    return
  }

  console.log("Updating location with payload:", payload)

  await $fetch("/api/admin/location/location", {
    method: "PUT",
    body: payload,
  })

  navigateTo("/admin/manage/locations")
}
</script>