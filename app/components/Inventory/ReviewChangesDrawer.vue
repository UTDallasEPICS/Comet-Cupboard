<template>
	<UContainer>
		<div v-if="inventoryStore.hasInventoryChanges === false" class="py-12 text-center">
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

			<SharedGroupedCollapsible :groups="inventoryStore.inventoryChangesItemsCategorized" :get-key="(item) => item.itemID" :default-open="true">
				<template #header="{ group, open }">
					<div class="flex flex-col gap-2">
						<SharedButtonPositiveAction
							:text="group"
							:trailing-icon="icons['chevronDown']"
							block
							class="group w-full rounded-lg"
							:ui="{
								trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
							}"
						/>
					</div>
				</template>

				<template #item="{ item: inventoryItem }">
					<InventoryReviewItemCard
						:key="inventoryItem.id"
						:name="inventoryItem.Item.name"
						:img-name="inventoryItem.Item.imgName"
						:item-deal="
							inventoryItem.Item.Deal
								? { actualCount: inventoryItem.Item.Deal.actualCount, adjustedCount: inventoryItem.Item.Deal.adjustedCount }
								: {}
						"
						:item-i-d="inventoryItem.id"
						:quantity="inventoryItem.Item.quantity"
						:change-count="inventoryItem.count"
					/>
				</template>
			</SharedGroupedCollapsible>

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
</script>
