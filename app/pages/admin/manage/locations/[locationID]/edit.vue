<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentLocation.name}`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UFormField name="image" label="Location Image" description="JPG or PNG. Max 2MB.">
							<div class="flex flex-col gap-2">
								<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
							</div>
						</UFormField>

						<UFormField id="name" name="name" label="Location Name">
							<UInput v-model="state.name" placeholder="Enter location name" />
						</UFormField>

						<UFormField id="description" name="description" label="Description">
							<UInput v-model="state.description" placeholder="Enter description" />
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

						<footer class="mt-4 flex justify-end">
							<SharedButtonPositiveAction type="submit" text="Submit" />
						</footer>
					</UForm>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import * as z from "zod"

definePageMeta({ layout: false })

const route = useRoute()
const locationName = route.params.locationID as string

const { data: locations } = await useFetch("/api/public/location/locations", {
	query: { includeArchived: true },
})

const currentLocation = computed(() => locations.value?.find((l) => l.name === locationName))

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
</script>
