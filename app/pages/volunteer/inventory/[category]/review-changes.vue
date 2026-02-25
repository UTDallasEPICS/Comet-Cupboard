<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/volunteer/inventory/${currentCategory}` }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Review Changes</SharedTextSectionTitle>
			<div class="mx-auto mt-4 flex w-full flex-row gap-4 sm:items-center sm:justify-start">
				<USelectMenu
					v-model="selectedSource"
					:items="sources?.map((s) => s.name) || []"
					ignore-filter
					icon="i-lucide-database"
					placeholder="Select a source"
					class="grow"
				/>
				<!-- <div v-if="fields.length > 0" class="flex flex-col gap-3 lg:flex-row">
					<UFormGroup v-for="fieldName in fields" :key="fieldName" :label="fieldName" class="w-72">
						<UInput v-model="fieldInputs[fieldName]" :placeholder="'Enter data'" />
					</UFormGroup>
				</div> -->
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in changedItems" :key="item.id">
					<InventoryReviewItemCard
						:key="item.id"
						:name="item.name"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.id"
						:quantity="item.oldCount"
						:new-quantity="item.newCount"
					/>
				</li>
			</ul>
		</section>

		<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
			<SharedButtonPositiveAction v-if="!selectedSource" text="No source selected" disabled />
			<SharedButtonPositiveAction v-else text="Submit" @click="submit" />
		</footer>
	</UContainer>
</template>

<script lang="ts" setup>
const route = useRoute()
const currentCategory = computed(() => route.params.category)
const selectedSource = ref("")
const { data: sources } = await useFetch("/api/volunteer/controls/sources")
const fields = ref<string[]>([])
const fieldInputs = ref<Record<string, string>>({})
const inventoryStore = useInventoryStore()
const changedItems = computed(() => inventoryStore.changedList)

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
		navigateTo(`/volunteer/inventory/${currentCategory.value}`)
	} catch (error) {
		console.error("Error submitting item count changes:", error)
	}
}
</script>
