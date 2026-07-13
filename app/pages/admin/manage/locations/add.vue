<template>
	<div>
		<NuxtLayout name="main" title="Add Location" :back-navigation="{ text: 'Back to Manage Locations', to: '/admin/manage/locations' }">
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UFormField
							id="image"
							name="image"
							label="Category Image"
							description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
						>
							<div class="flex flex-col gap-2">
								<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
							</div>
						</UFormField>

						<UFormField id="name" name="name" label="Location Name">
							<UInput v-model="state.name" />
						</UFormField>

						<UFormField id="description" name="description" label="Description">
							<UInput v-model="state.description" />
						</UFormField>

						<UFormField id="address" name="address" label="Address">
							<UInput v-model="state.address" />
						</UFormField>

						<UCard :ui="{ header: 'p-2', body: 'p-2' }">
							<template #header>
								<SharedTextBase> Existing Locations with Similar Names </SharedTextBase>
							</template>

							<ul class="space-y-1">
								<li v-for="item in mostSimilarItems" :key="item.name">
									<SharedTextBase>{{ item.name }}</SharedTextBase>
								</li>
							</ul>
						</UCard>

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

const formSchema = z.object({
	name: z.string().min(1, "Location name is required"),
	address: z.string().min(1, "Address is required"),
	description: z.string().url("Must be a valid URL").or(z.literal("")),
	image: z.any().refine((file) => file, "An image is required"),
})

const { state, validate, onError } = createFormBuilder(formSchema, () => ({
	name: "",
	address: "",
	description: "",
	image: undefined,
}))

const { data: locations } = await useFetch("/api/public/location/locations", {
	query: { includeArchived: true },
})

const { query, filtered } = useFuzzySearch(locations ?? ref([]), {
	searchKeys: ["name"],
})

watch(
	() => state.value.name,
	(val) => (query.value = val || ""),
	{ immediate: true }
)

const mostSimilarItems = computed(() => filtered.value.slice(0, 5))

const onSubmit = async (event: any) => {
	try {
		const formData = new FormData()

		formData.append("originalName", "")

		formData.append("name", event.data.name)
		formData.append("address", event.data.address)
		formData.append("description", event.data.description || "")
		formData.append("archived", "false")

		if (event.data.image) {
			formData.append("image", event.data.image)
		}

		await $fetch("/api/admin/location/location", {
			method: "PUT",
			body: formData,
		})

		await navigateTo("/admin/manage/locations")
	} catch (error: any) {
		//Something
	}
}
</script>
