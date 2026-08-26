<template>
	<UCard class="relative w-full min-w-72 overflow-hidden shadow-md" :ui="{ body: 'p-0 sm:p-0' }">
		<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />
		<div class="relative flex min-h-24 items-center gap-4 p-4">
			<img
				:src="`/api/public/image/${primarySpecificItem.imgName}`"
				:alt="name"
				class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover"
			/>
			<div class="min-w-0">
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				<SharedTextBaseSecondary>{{ totalCount }} in cart</SharedTextBaseSecondary>
				<SharedTextBaseSecondary>{{ itemFinalCount }} counted</SharedTextBaseSecondary>
			</div>
			<SharedButtonActionButton
				:trailing-icon="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
				size="sm"
				variant="ghost"
				action="neutral"
				class="absolute right-2 bottom-1"
				text="See adjustments"
				aria-label="Show item details"
				@click="isOpen = !isOpen"
			/>
		</div>
		<UCollapsible v-model:open="isOpen">
			<template #content>
				<USeparator />
				<div class="space-y-3 p-4">
					<div v-for="specificItem in specificItems" :key="specificItem.specificItemID" class="flex items-center gap-3">
						<img
							:src="`/api/public/image/${specificItem.imgName}`"
							:alt="`${name} (${specificItem.productName})`"
							class="border-border-soft h-12 w-12 shrink-0 rounded-md border object-cover"
						/>
						<div>
							<SharedTextBaseSecondary>{{ specificItem.productName == "Default" ? name : specificItem.productName }}</SharedTextBaseSecondary>
							<SharedTextBaseSecondary
								>{{ specificItem.count }} in cart{{
									specificItem.countAdjustment ? ` (${specificItem.countAdjustment} adjusted)` : ""
								}}</SharedTextBaseSecondary
							>
						</div>
					</div>
					<USeparator />
					<div class="flex items-center justify-between">
						<SharedTextBaseSecondary>Count after deals:</SharedTextBaseSecondary>
						<SharedTextBaseSecondary>{{ itemFinalCount }}</SharedTextBaseSecondary>
					</div>
				</div>
			</template>
		</UCollapsible>
	</UCard>
</template>

<script setup lang="ts">
type SpecificCartItem = { specificItemID: string; productName: string; imgName: string; count: number; countAdjustment: number }

const props = defineProps({
	name: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	specificItems: { type: Array as PropType<SpecificCartItem[]>, default: () => [] },
	itemFinalCount: { type: Number, default: 0 },
})

const isOpen = ref(props.specificItems.some((specificItem) => specificItem.countAdjustment !== 0))
const primarySpecificItem = computed(() => props.specificItems[0] ?? { imgName: "" })
const totalCount = computed(() => props.specificItems.reduce((total, specificItem) => total + specificItem.count, 0))
</script>
