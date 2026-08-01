<!-- <template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentLocation.name}`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<USeparator class="my-4" />
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
</script> -->

<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentLocation.name}`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<UFormField
								id="image"
								name="image"
								label="Item Image"
								description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
								required
							>
								<div class="flex flex-col gap-2">
									<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
								</div>
							</UFormField>
						</UCard>

						<UCard>
							<UFormField
								id="locationName"
								name="locationName"
								label="Location Name"
								description="Location name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.locationName" placeholder="Enter location name" />

								<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
									<div class="mb-2 flex items-center gap-2">
										<SharedTextBaseSecondary> Similar existing locations </SharedTextBaseSecondary>
									</div>

									<div class="flex flex-wrap gap-2">
										<UBadge
											v-for="similarItem in mostSimilarItems"
											:key="similarItem.name"
											:label="similarItem.name"
											color="neutral"
											variant="soft"
										/>
									</div>

									<SharedTextBaseSecondary class="mt-2 text-xs">
										Check that you're not creating a duplicate location.
									</SharedTextBaseSecondary>
								</div>
							</UFormField>
						</UCard>
						<UCard>
							<UFormField id="description" name="description" label="Description">
								<UTextarea v-model="state.description" placeholder="Enter description" class="w-full" />
							</UFormField>
						</UCard>
						<UCard>
							<UFormField id="archived" name="archived" label="Archived" description="Check if the location is archived">
								<UCheckbox v-model="state.archived" label="Archived" />
							</UFormField>
						</UCard>

						<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
							<SharedButtonPositiveAction type="submit" text="Submit" />
						</footer>
					</UForm>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const route = useRoute()
const locationID = route.params.locationID as string

const { data: locations } = await useFetch("/api/public/location/locations", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const currentLocation = computed(() => {
	return locations.value?.find((location) => location.name === locationID)
})

const originalImage = ref<Blob | null>(null)

watchEffect(async () => {
	if (currentLocation.value) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${currentLocation.value.imgName}`, { responseType: "blob" })
		state.value.image = new File([originalImage.value], currentLocation.value.imgName, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
	}
})

const formSchema = imageSchema
	.extend({
		locationName: z
			.string()
			.min(1, "Location name is required")
			.max(20, "Location name must be at most 20 characters")
			.regex(/^[A-Za-z ]+$/, "Location name must only contain letters and spaces"),
		description: z.string().or(z.literal("")),
		archived: z.boolean().default(false),
	})
	.partial({
		image: true,
		locationName: true,
		description: true,
		archived: true,
	})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: originalImage.value
		? new File([originalImage.value], currentLocation.value?.imgName, {
				type: originalImage.value.type,
			})
		: undefined,
	locationName: currentLocation.value?.name || undefined,
	description: currentLocation.value?.description || undefined,
	archived: currentLocation.value?.archived || false,
}))

const { query, filtered } = useFuzzySearch(locations ?? ref([]), { searchKeys: ["name"] })
watch(
	() => state.value.locationName,
	(name) => {
		query.value = name || ""
	},
	{ immediate: true }
)
const mostSimilarItems = computed(() => {
	return filtered.value.slice(0, 5)
})

const onSubmit = async (event) => {
	try {
		const formData = new FormData()
		formData.append("originalName", locationID)
		if (event.data.locationName) {
			formData.append("name", event.data.locationName)
		}
		if (event.data.description) {
			formData.append("description", event.data.description)
		}
		if (event.data.archived !== undefined) {
			formData.append("archived", event.data.archived.toString())
		}
		if (event.data.image) {
			formData.append("image", event.data.image)
		}

		await $fetch("/api/admin/location/location", {
			method: "PUT",
			body: formData,
		})

		navigateTo("/admin/manage/locations")
	} catch (error) {
		// idk for now
	}
}
</script>
