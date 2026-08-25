<template>
	<div>
		<NuxtLayout name="main" :title="`Add Location`" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<ManageLocationEditorLocationForm :locations="locations ?? []" :initial-values="initialValues" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import type { CreateLocationForm } from "#shared/utils/formSchemas"

definePageMeta({ layout: false })

const initialValues: CreateLocationForm = {
	image: undefined,
	locationName: "",
	description: "",
	mapEmbedUrl: "",
}

const { data: locations } = await useFetch<any[]>("/api/volunteer/location", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const onSubmit = async (data: CreateLocationForm) => {
	try {
		const formData = new FormData()
		formData.append("locationID", "")
		formData.append("locationName", data.locationName)
		formData.append("description", data.description)
		formData.append("mapEmbedUrl", data.mapEmbedUrl || "")
		if (data.image) {
			formData.append("image", data.image)
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
