<template>
	<div class="border-border-soft rounded-lg border p-3">
		<div class="flex items-center justify-between gap-3">
			<div>
				<div class="font-semibold">{{ session.inventoryIntakeSessionName }}</div>
				<div class="text-sm text-gray-600">{{ session.sourceName }}</div>
			</div>
		</div>
		<div class="mt-1 text-sm">{{ new Date(session.intakeDate).toLocaleDateString() }}</div>
		<div v-if="session.notes" class="mt-1 text-sm">{{ session.notes }}</div>
		<UCollapsible class="mt-3 border-t pt-2">
			<SharedButtonActionButton action="neutral" variant="ghost" block class="justify-between" trailing-icon="i-lucide-chevron-down">
				{{ session.completedInventoryIntakeSessionItems.length }} Products Changed
			</SharedButtonActionButton>
			<template #content>
				<div class="mt-2 space-y-2">
					<div
						v-for="item in session.completedInventoryIntakeSessionItems"
						:key="`${session.completedInventoryIntakeSessionID}-${item.specificItemID}`"
						class="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-2 text-sm"
					>
						<div>
							<div class="font-medium">{{ item.specificItem.item.itemName }}</div>
							<div class="text-xs text-gray-600">{{ item.specificItem.productName }}</div>
						</div>
						<SharedTextBaseSecondary :class="item.amountChanged >= 0 ? 'text-green-700' : 'text-red-700'" class="font-semibold">
							{{ item.amountChanged >= 0 ? "+" : "" }}{{ item.amountChanged }}
						</SharedTextBaseSecondary>
					</div>
				</div>
			</template>
		</UCollapsible>
	</div>
</template>

<script setup lang="ts">
type IntakeSession = {
	completedInventoryIntakeSessionID: string
	inventoryIntakeSessionName: string
	sourceName: string
	intakeDate: string
	notes?: string | null
	completedInventoryIntakeSessionItems: {
		specificItemID: string
		amountChanged: number
		specificItem: { productName: string; item: { itemName: string } }
	}[]
}

defineProps<{ session: IntakeSession }>()
</script>
