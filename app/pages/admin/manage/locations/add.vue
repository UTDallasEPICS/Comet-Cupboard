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
			<SharedTextSectionTitle>Add Location</SharedTextSectionTitle>

			<div class="mx-auto w-min">
				<UForm
					:validate="validate"
					:state="state"
					class="w-96 space-y-4"
					@submit="onSubmit"
					@error="onError"
				>
					<UFormField id="name" name="name" label="Location Name">
						<UInput v-model="state.name" />
					</UFormField>

					<UFormField id="address" name="address" label="Address">
						<UInput v-model="state.address" />
					</UFormField>

					<UCard :ui="{ header: 'p-2', body: 'p-2' }">
						<template #header>
							<SharedTextBase>
								Existing Locations with Similar Names
							</SharedTextBase>
						</template>

						<ul class="space-y-1">
							<li v-for="item in mostSimilarItems" :key="item.name">
								<SharedTextBase>{{ item.name }}</SharedTextBase>
							</li>
						</ul>
					</UCard>

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

const formSchema = z.object({
	name: z.string().min(1, "Location name required"),
	address: z.string().min(1, "Address required"),
})

const { state, validate, onError } = createFormBuilder(formSchema, () => ({
	name: undefined,
	address: undefined,
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

const onSubmit = async (event) => {

	await $fetch("/api/admin/location/location", {
		method: "POST",
		body: {
		name: event.data.name,
		address: event.data.address,
	    }
	})

	navigateTo("/admin/manage/locations")
}
</script>