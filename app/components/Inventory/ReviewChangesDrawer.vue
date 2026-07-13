<template>
	<UContainer>
		<div v-if="inventoryItemsMap.length === 0" class="py-12 text-center">
			<SharedTextBase>No changes to review</SharedTextBase>
		</div>
		<div v-else>
			<USelectMenu
				v-model="selectedSource"
				:items="sources || []"
				value-key="sourceID"
				label-key="name"
				ignore-filter
				:icon="icons['sources']"
				placeholder="Select a source"
				class="grow"
			/>
			<!-- <div v-if="fields.length > 0" class="flex flex-col gap-3 lg:flex-row">
				<UFormGroup v-for="fieldName in fields" :key="fieldName" :label="fieldName" class="w-72">
					<UInput v-model="fieldInputs[fieldName]" :placeholder="'Enter data'" />
				</UFormGroup>
			</div> -->
			<ul class="mt-4 flex w-full max-w-md flex-col items-center gap-4">
				<li v-for="item in inventoryItemsMap" :key="item.id">
					<InventoryReviewItemCard
						:key="item.id"
						:name="item.name"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.id"
						:quantity="item.oldCount"
						:change-count="item.changeCount"
					/>
				</li>
			</ul>

			<div class="flex justify-center pt-6">
				<SharedButtonPositiveAction v-if="!selectedSource" text="No source selected" disabled />
				<SharedButtonPositiveAction v-else text="Submit" @click="inventoryStore.submitChanges(selectedSource, fieldInputs)" />
			</div>
		</div>
	</UContainer>
</template>

<script lang="ts" setup>
const selectedSource = ref("")
const { data: sources } = await useFetch("/api/volunteer/inventory/sources")
const { data: items } = await useFetch("/api/student/inventory/items")
const fields = ref<string[]>([])
const fieldInputs = ref<Record<string, string>>({})
const inventoryStore = useInventoryStore()

const inventoryItemsMap = computed(() => {
	return (
		items.value
			?.filter((item) => {
				return inventoryStore.inventoryChangesItems.some((change) => change.itemID === item.itemID)
			})
			.map((item) => {
				const change = inventoryStore.inventoryChangesItems.find((c) => c.itemID === item.itemID)
				return {
					id: item.itemID,
					name: item.name,
					imgName: item.imgName,
					Deal: item.Deal,
					oldCount: item.quantity,
					changeCount: change ? change.count : 0,
				}
			}) || []
	)
})
</script>
