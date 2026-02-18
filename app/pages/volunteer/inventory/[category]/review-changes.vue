<template>
	<div class="p-4">
		<USelect v-model="selectedSource" :items="sources.map((s) => s.name)" placeholder="Select source" class="w-48" />
		<!-- Metadata input field -->
		<div v-if="fields.length > 0" class="flex flex-col gap-3 lg:flex-row">
				<div v-for="fieldName in fields" :key="fieldName" class="flex w-72 flex-col gap-1">
					<label :for="fieldName" class="">{{ fieldName }}</label>

					<div
						class="flex h-12 items-center rounded-md border border-gray-300 bg-white transition-all duration-50"
						:class="{ 'focus-within:shadow-md focus-within:border-blue-400': true }"
					>
						<input
							v-model="fieldInputs[fieldName]"
							type="text"
							placeholder="Enter data"
							:id="fieldName"
							class="w-full border-none bg-transparent pl-2 outline-none"
						/>
					</div>
				</div>
			</div>
		<div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 250px))', gap: '1rem' }" class="mx-auto my-4 w-full">
			<InventoryReviewItemCard
				v-for="item in changedItems"
				:key="item.id"
				:adjusted-count="item.newCount"
				:img-name="item.imgName"
				:item-count="item.oldCount"
				:item-name="item.name"
			/>
		</div>

		<div class="lg_mt-0 lg_justify-end lg_self-end mt-32 flex flex-row gap-x-4">
			<SharedButtonCancel text="Cancel" @click="goBack" />
			<SharedButtonPositiveAction :disabled="!selectedSource" text="Submit" @click="submit" />
		</div>
	</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const category = route.params.category as string
const selectedSource = ref<string | null>(null)
const { data: sources } = await useFetch("/api/volunteer/controls/sources")
const fields = ref<string[]>([])
const fieldInputs = ref<Record<string, string>>({})
const inventoryStore = useInventoryStore()
const changedItems = computed(() => inventoryStore.changedList)

const goBack = () => {
	navigateTo(`/volunteer/inventory/${category}`)
}

// Handling metadata being present in a source
watch(selectedSource, async (newSource) => {
	if (newSource) {
		const { data } = await useFetch("/api/volunteer/controls/fields", {
			query: { source: newSource },
		})
		fields.value = data.value?.map((field) => field.name) || []
		fieldInputs.value = Object.fromEntries(fields.value.map((name) => [name, ""]))
	} else {
		fields.value = []
		fieldInputs.value = {}
	}
})

const submit = async () => {
	try {
		if (!selectedSource.value) return

		const inventoryCountChanges = changedItems.value.map((item) => ({
			itemID: item.id,
			countChange: item.newCount - item.oldCount,
		}))

		await $fetch("/api/volunteer/inventory/itemCountChanges", {
			method: "POST",
			body: {
				source: selectedSource.value,
				fieldMap: fieldInputs.value,
				inventoryCountChanges,
			},
		})
		inventoryStore.resetChanges()
		navigateTo(`/volunteer/inventory/${category}`)
	} catch (error) {
		console.error("Error submitting item count changes:", error)
	}
}
</script>
