<template>
	<div>
		<NuxtLayout name="main" :title="`Add Location`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<UFormField
								id="image"
								name="image"
								label="Location Image"
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

const formSchema = imageSchema.extend({
	locationName: z
		.string()
		.min(1, "Location name is required")
		.max(20, "Location name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Location name must only contain letters and spaces"),
	description: z.string().or(z.literal("")),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: undefined,
	locationName: undefined,
	description: undefined,
}))

const { data: locations } = await useFetch("/api/public/location/locations", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

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
		formData.append("name", event.data.locationName)
		formData.append("description", event.data.description)
		if (event.data.image) {
			formData.append("image", event.data.image)
		}
		formData.append("archived", "false")

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
