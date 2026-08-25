<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentLocation.name}`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<ManageLocationEditorLocationForm :locations="locations ?? []" :initial-values="initialValues" :show-archived="true" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import type { EditLocationForm } from "#shared/utils/formSchemas"

definePageMeta({ layout: false })

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
const image = ref<File>()

watchEffect(async () => {
	if (currentLocation.value) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${currentLocation.value.imgName}`, { responseType: "blob" })
		image.value = new File([originalImage.value], currentLocation.value.imgName, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
		image.value = undefined
	}
})

const initialValues = computed<EditLocationForm>(() => ({
	image: image.value,
	locationName: currentLocation.value?.locationName,
	description: currentLocation.value?.description,
	mapEmbedUrl: currentLocation.value?.mapEmbedUrl || "",
	archived: currentLocation.value?.archived ?? false,
}))

const onSubmit = async (data: EditLocationForm) => {
	try {
		const formData = new FormData()
		formData.append("locationID", locationID)
		formData.append("locationName", data.locationName || "")
		formData.append("description", data.description || "")
		formData.append("mapEmbedUrl", data.mapEmbedUrl || "")
		if (data.archived !== undefined) {
			formData.append("archived", data.archived.toString())
		}
		if (data.image) {
			formData.append("image", data.image)
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
