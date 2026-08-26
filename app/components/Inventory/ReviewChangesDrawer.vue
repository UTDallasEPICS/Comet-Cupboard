<template>
	<UContainer :ui="{
		base: 'px-2 sm:px-2 lg:px-2'
	}">
		<Transition name="slide" mode="out-in">
			<div :key="view" class="space-y-4">
				<InventoryEditorIntakeSessionStartForm
					v-if="view === 'create'"
					:sources="sources ?? []"
					@cancel="view = 'review'"
					@started="handleSessionStarted"
				/>
				<template v-else>
					<SharedLayoutSectionUCard title="Inventory Intake Session" class-name="space-y-4">
						<template #headerContent>
							<SharedButtonActionButton
								leading-icon="i-lucide-plus"
								text="Start session"
								action="positive"
								@click="view = 'create'"
								class="w-full"
							/>
						</template>
						<USelectMenu
							v-model="selectedSessionID"
							:items="inventoryStore.activeIntakeSessions"
							value-key="inventoryIntakeSessionID"
							label-key="inventoryIntakeSessionName"
							placeholder="Select a session"
							class="w-full"
						/>
						<div class="mt-2 flex w-full flex-row items-center justify-end">
							<SharedButtonActionButton
								v-if="selectedSession"
								text="Clear Session"
								leading-icon="i-lucide-x"
								action="cancel"
								@click="inventoryStore.clearIntakeSession()"
							/>
						</div>
						<SharedTextBaseSecondary v-if="selectedSession" class="mt-4"> Source: {{ selectedSession.sourceName }} </SharedTextBaseSecondary>
						<SharedTextBaseSecondary v-if="selectedSession" class="mt-2">
							Notes: {{ selectedSession.notes || "No notes" }}
						</SharedTextBaseSecondary>
					</SharedLayoutSectionUCard>

					<SharedLayoutSectionUCard v-if="selectedSession" title="Inventory Changes">
						<div v-if="inventoryStore.hasInventoryChanges" class="space-y-4">
							<div class="flex justify-end">
								<UButtonGroup class="flex flex-row items-center justify-end gap-2">
									<SharedButtonActionButton
										text="Incremental"
										action="positive"
										:button-variant="changeView === 'incremental' ? 'solid' : 'outline'"
										@click="changeView = 'incremental'"
									/>
									<SharedButtonActionButton
										text="Aggregated"
										action="positive"
										:button-variant="changeView === 'aggregated' ? 'solid' : 'outline'"
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
								<SharedButtonActionButton
									action="positive"
									text="Submit"
									leading-icon="i-lucide-check"
									@click="inventoryStore.submitChanges()"
								/>
							</div>
						</div>
						<SharedTextBaseSecondary v-else>No changes made yet</SharedTextBaseSecondary>
					</SharedLayoutSectionUCard>
				</template>
			</div>
		</Transition>
	</UContainer>
</template>

<script lang="ts" setup>
const inventoryStore = useInventoryStore()
const view = ref<"review" | "create">("review")
const changeView = ref<"incremental" | "aggregated">("aggregated")
const { data: sources } = await useFetch<{ sourceID: string; sourceName: string }[]>("/api/volunteer/inventory/source")
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
