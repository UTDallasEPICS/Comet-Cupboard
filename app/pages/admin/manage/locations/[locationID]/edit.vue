<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentLocation.name}`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<SharedFormShell :validate="validate" :state="state" class="w-full space-y-4" :on-submit="onSubmit" :on-error="onError">
						<SharedLayoutSectionUCard title="Location Image">
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
						</SharedLayoutSectionUCard>
						<SharedLayoutSectionUCard title="Location Details">
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
											:key="similarItem.locationName"
											:label="similarItem.locationName"
											color="neutral"
											variant="soft"
										/>
									</div>

									<SharedTextBaseSecondary class="mt-2 text-xs">
										Check that you're not creating a duplicate location.
									</SharedTextBaseSecondary>
								</div>
							</UFormField>
						</SharedLayoutSectionUCard>
						<SharedLayoutSectionUCard title="Description">
							<UFormField id="description" name="description" label="Description">
								<UTextarea v-model="state.description" placeholder="Enter description" class="w-full" />
							</UFormField>
						</SharedLayoutSectionUCard>
						<SharedLayoutSectionUCard title="Map Details">
							<UFormField
								name="mapEmbedUrl"
								label="Optional UTD Campus Map Embed URL"
								description="Use https://map.concept3d.com/?id=1772#!m/<map-id>"
							>
								<UInput v-model="state.mapEmbedUrl" placeholder="https://map.concept3d.com/?id=1772#!m/551906" class="w-full" />

								<SharedButtonActionButton variant="link" color="primary" class="mt-2 px-0" @click="showMapDirections = true">
									<SharedIcon name="i-lucide-circle-help" class="mr-1" />
									Click for directions on getting this information
								</SharedButtonActionButton>
							</UFormField>
						</SharedLayoutSectionUCard>

						<UModal v-model:open="showMapDirections" title="How to Find the Campus Map URL">
							<template #body>
								<div class="space-y-4">
									<div class="space-y-2">
										<SharedTextCardTitle>Step 1</SharedTextCardTitle>

										<SharedTextBaseSecondary
											>Find the location on the UTD campus map that you want to link to and click the Share
											button.</SharedTextBaseSecondary
										>

										<img
											src="/CampusURLSharePart1.png"
											alt="Instructions for finding the UTD campus map location"
											class="border-border-soft w-full rounded-lg border"
										/>
									</div>

									<div class="space-y-2">
										<SharedTextCardTitle>Step 2</SharedTextCardTitle>

										<SharedTextBaseSecondary>Paste the URL section into the map URL input</SharedTextBaseSecondary>

										<img
											src="/CampusURLSharePart2.png"
											alt="Instructions for copying the UTD campus map URL"
											class="border-border-soft w-full rounded-lg border"
										/>
									</div>
								</div>
							</template>
						</UModal>
						<SharedLayoutSectionUCard title="Availability">
							<UFormField id="archived" name="archived" label="Archived" description="Check if the location is archived">
								<UCheckbox v-model="state.archived" label="Archived" />
							</UFormField>
						</SharedLayoutSectionUCard>

						<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
							<SharedButtonActionButton action="positive" type="submit" text="Submit" />
						</footer>
					</SharedFormShell>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import { editLocationSchema } from "~/utils/formSchemas"

definePageMeta({ layout: false })

const showMapDirections = ref(false)

const route = useRoute()
const locationID = route.params.locationID as string

const { data: locations } = await useFetch("/api/volunteer/location", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const currentLocation = computed(() => {
	return locations.value?.find((location) => location.locationID === locationID)
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

const { schema, state, validate, onError } = createFormBuilder(editLocationSchema, () => ({
	image: originalImage.value
		? new File([originalImage.value], currentLocation.value?.imgName, {
				type: originalImage.value.type,
			})
		: undefined,
	locationName: currentLocation.value?.locationName || undefined,
	description: currentLocation.value?.description || undefined,
	mapEmbedUrl: currentLocation.value?.mapEmbedUrl || "",
	archived: currentLocation.value?.archived || false,
}))

const { query, filtered } = useFuzzySearch(locations ?? ref([]), { searchKeys: ["locationName"] })
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
		formData.append("locationID", locationID)
		formData.append("locationName", event.data.locationName || "")
		formData.append("description", event.data.description || "")
		formData.append("mapEmbedUrl", event.data.mapEmbedUrl || "")
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
