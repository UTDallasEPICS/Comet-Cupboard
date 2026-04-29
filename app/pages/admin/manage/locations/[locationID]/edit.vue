<template>
  <UContainer class="py-8">
    <header>
      <SharedButtonNavigateBack
        text="Back to Manage Locations"
        :to="{ path: '/admin/manage/locations' }"
      />

      <UButton icon="i-heroicons-question-mark-circle" color="gray" variant="ghost" label="Take a Tour"
				@click="startTour" />

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
          <UFormField id="image" name="image" label="Location Image" description="JPG or PNG. Max 2MB.">
            <div class="flex flex-col gap-2">
							<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
						</div>
          </UFormField>

          <UFormField id="name" name="name" label="Location Name">
            <UInput v-model="state.name" placeholder="Enter location name" />
          </UFormField>

          <UFormField id="link" name="description" label="Link">
            <UInput v-model="state.description" placeholder="Enter link" />
          </UFormField>

          <UFormField id="address" name="address" label="Address">
            <UInput v-model="state.address" placeholder="Enter address" />
          </UFormField>

          <UCard :ui="{ header: 'p-2', body: 'p-2' }">
            <template #header>
              <SharedTextBase>Existing Locations with Similar Names</SharedTextBase>
            </template>
            <template #default>
              <ul class="space-y-1" id="similar">
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
            <SharedButtonPositiveAction id="submit" type="submit" text="Submit" />
          </footer>
        </UForm>
      </div>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
import * as z from "zod"
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { onMounted } from "vue";

const route = useRoute()
// Ensure we use the correct param name from your router configuration
const locationName = (route.params.name || route.params.locationID || route.params.id) as string
if (!locationName) throw new Error("Location name not found in route")

const { data: locations } = await useFetch("/api/public/location/locations", {
  query: { includeArchived: true },
})

const currentLocation = computed(() =>
  locations.value?.find((l) => l.name === locationName)
)

// 1. Updated Schema to include the 'image' field for the file upload
const formSchema = z.object({
  name: z.string().min(1, "Location name cannot be empty").optional(),
  address: z.string().min(1, "Address cannot be empty").optional(),
  description: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  image: z.any().optional(), // Added for multipart support
  archived: z.boolean().optional(),
})

const { state, validate, onError } = createFormBuilder(formSchema, () => ({
  name: currentLocation.value?.name,
  address: currentLocation.value?.address,
  description: currentLocation.value?.description,
  image: undefined,
  archived: currentLocation.value?.archived ?? false,
}))

// Fuzzy search logic remains the same...
const { query, filtered } = useFuzzySearch(locations ?? ref([]), {
  searchKeys: ["name"],
})

watch(
  () => state.value.name,
  (val) => (query.value = val || ""),
  { immediate: true }
)

const mostSimilarItems = computed(() => filtered.value.slice(0, 5))

// 2. Updated onSubmit to use FormData
const onSubmit = async (event: any) => {
  try {
    const formData = new FormData()

    // Required for the backend to identify which record to update
    formData.append("originalName", locationName)

    // Append text fields from the validated event data
    if (event.data.name) formData.append("name", event.data.name.trim())
    if (event.data.address) formData.append("address", event.data.address.trim())
    if (event.data.description) formData.append("description", event.data.description.trim())
    
    // Convert boolean to string "true"/"false" to match backend z.enum
    formData.append("archived", event.data.archived ? "true" : "false")

    // Append the image file if a new one was selected
    if (event.data.image) {
      formData.append("image", event.data.image)
    }

    await $fetch("/api/admin/location/location", {
      method: "PUT",
      body: formData, // Sending FormData instead of JSON
    })

    navigateTo("/admin/manage/locations")
  } catch (error: any) {
    console.error("Update failed:", error)
  }
}

const startTour = () => {
	driverObj.drive();
};

const driverObj = driver({
	showProgress: true,
	steps: [
		{
			element: '#image',
			popover: {
				title: 'Upload Image',
				description: 'Edit uploaded image for the location.'
			}
		},
		{
			element: '#name',
			popover: {
				title: 'Location Name',
				description: 'Change the name of the location.'
			}
		},
		{
			element: '#link',
			popover: {
				title: 'Link',
				description: 'Change the link to the website of the location.'
			}
		},
		{
			element: '#address',
			popover: {
				title: 'Address',
				description: 'Change the address of the location.'
			}
		},
		{
			element: '#similar',
			popover: {
				title: 'Similar Locations',
				description: 'View and avoid creating duplicates.'
			}
		},
    {
			element: '#archived',
			popover: {
				title: 'Archived',
				description: 'Check this box to archive the location.'
			}
		},
		{
			element: '#submit',
			popover: {
				title: 'Submit',
				description: 'Click here to save changes to the location.'
			}
		}
	]
})

onMounted(() => {
	//diverObj.drive();
});
</script>