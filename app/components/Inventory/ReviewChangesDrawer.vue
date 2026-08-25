<template>
	<UContainer>
		<Transition name="slide" mode="out-in">
			<div :key="view" class="space-y-4">
				<InventoryIntakeSessionStartForm v-if="view === 'create'" :sources="sources ?? []" @cancel="view = 'review'" @started="handleSessionStarted" />
				<template v-else>
					<UCard>
						<div class="flex items-center justify-between gap-2">
							<SharedTextCardTitle>Inventory Intake Session</SharedTextCardTitle>
							<SharedButtonActionButton icon="i-lucide-plus" label="Start session" color="secondary" @click="view = 'create'" />
						</div>
						<USelectMenu
							v-model="selectedSessionID"
							:items="inventoryStore.activeIntakeSessions"
							value-key="inventoryIntakeSessionID"
							label-key="inventoryIntakeSessionName"
							placeholder="Select a session"
							class="mt-2 w-full"
						/>
						<SharedTextBaseSecondary v-if="selectedSession" class="mt-2">
							{{ selectedSession.sourceName }} · {{ selectedSession.notes || "No notes" }}
						</SharedTextBaseSecondary>
						<SharedButtonActionButton
							v-if="selectedSession"
							label="Clear Session"
							icon="i-lucide-x"
							color="neutral"
							variant="ghost"
							class="mt-2"
							@click="inventoryStore.clearIntakeSession()"
						/>
					</UCard>
					<div v-if="inventoryStore.hasInventoryChanges">
						<div class="flex justify-end">
							<UButtonGroup>
								<SharedButtonActionButton
									label="Incremental"
									color="neutral"
									:variant="changeView === 'incremental' ? 'solid' : 'outline'"
									@click="changeView = 'incremental'"
								/>
								<SharedButtonActionButton
									label="Aggregated"
									color="neutral"
									:variant="changeView === 'aggregated' ? 'solid' : 'outline'"
									@click="changeView = 'aggregated'"
								/>
							</UButtonGroup>
						</div>
						<div v-if="changeView === 'incremental'" class="space-y-3">
							<DomainCardInventoryReviewItemCard
								v-for="inventoryItem in inventoryStore.inventoryChangesItems"
								:key="inventoryItem.InventoryIntakeSessionItemChangeID"
								:name="specificItemName(inventoryItem.specificItem)"
								:img-name="inventoryItem.specificItem.imgName"
								:item-deal="
									inventoryItem.specificItem.item.deal
										? {
												actualCount: inventoryItem.specificItem.item.deal.actualCount,
												adjustedCount: inventoryItem.specificItem.item.deal.adjustedCount,
											}
										: {}
								"
								:item-i-d="inventoryItem.specificItemID"
								:change-count="inventoryItem.amountChanged"
							/>
						</div>
						<SharedLayoutGroupedCollapsible
							v-else
							:groups="inventoryStore.inventoryChangesItemsAggregatedCategorized"
							:get-key="(item) => item.specificItemID"
							:default-open="true"
						>
							<template #header="{ group, open }">
								<div class="flex flex-col gap-2">
									<SharedButtonActionButton
										action="positive"
										:text="group"
										trailing-icon="i-lucide-chevron-down"
										block
										class="group w-full rounded-lg"
										:ui="{
											trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
										}"
									/>
								</div>
							</template>

							<template #item="{ item: inventoryItem }">
								<DomainCardInventoryReviewItemCard
									:key="inventoryItem.specificItemID"
									:name="specificItemName(inventoryItem.specificItem)"
									:img-name="inventoryItem.specificItem.imgName"
									:item-deal="
										inventoryItem.specificItem.item.deal
											? {
													actualCount: inventoryItem.specificItem.item.deal.actualCount,
													adjustedCount: inventoryItem.specificItem.item.deal.adjustedCount,
												}
											: {}
									"
									:item-i-d="inventoryItem.specificItemID"
									:change-count="inventoryItem.amountChanged"
								/>
							</template>
						</SharedLayoutGroupedCollapsible>

						<div class="flex justify-center pt-6">
							<SharedButtonActionButton action="positive" text="Submit" @click="inventoryStore.submitChanges()" />
						</div>
					</div>
				</template>
			</div>
		</Transition>
	</UContainer>
</template>

<script lang="ts" setup>
const { data: sources } = await useFetch("/api/volunteer/inventory/source")
const inventoryStore = useInventoryStore()
const view = ref<"review" | "create">("review")
const changeView = ref<"incremental" | "aggregated">("aggregated")
const selectedSessionID = computed({
	get: () => inventoryStore.selectedIntakeSessionID,
	set: (inventoryIntakeSessionID) => {
		if (inventoryIntakeSessionID) void inventoryStore.selectIntakeSession(inventoryIntakeSessionID)
	},
})
await inventoryStore.getActiveIntakeSessions()

const selectedSession = computed(() =>
	inventoryStore.activeIntakeSessions.find((session) => session.inventoryIntakeSessionID === inventoryStore.selectedIntakeSessionID)
)
const handleSessionStarted = async (inventoryIntakeSessionID: string) => {
	await inventoryStore.getActiveIntakeSessions()
	await inventoryStore.selectIntakeSession(inventoryIntakeSessionID)
	view.value = "review"
}

const specificItemName = (specificItem: { productName: string; item: { itemName: string } }) =>
	`${specificItem.productName == "Default" ? specificItem.item.itemName : specificItem.productName}`
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: all 0.25s ease;
}

.slide-enter-from {
	transform: translateX(100%);
	opacity: 0;
}

.slide-leave-to {
	transform: translateX(-100%);
	opacity: 0;
}
</style>
