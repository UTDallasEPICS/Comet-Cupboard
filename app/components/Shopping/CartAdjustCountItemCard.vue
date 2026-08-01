<template>
	<UCollapsible v-model:open="isOpen" class="w-full min-w-72" disabled>
		<UCard
			class="relative w-full min-w-72 shadow-md"
			:ui="{
				body: 'p-0 py-0 sm:p-0 sm:py-0',
			}"
		>
			<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />

			<div class="flex flex-row items-center gap-2">
				<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-l-lg border object-cover" />

				<div class="flex w-full flex-col p-2">
					<div class="flex flex-row items-center justify-between">
						<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
					</div>

					<div class="flex flex-row items-center gap-2">
						<UBadge :label="`In cart: ${count}`" variant="outline" color="neutral" />
						<UBadge :label="`Final count: ${finalCount.count}`" variant="outline" color="neutral" />
					</div>
				</div>
			</div>
			<UButton :icon="icons['chevronDown']" size="sm" variant="ghost" color="neutral" class="absolute right-2 bottom-2" @click="isOpen = !isOpen" />
		</UCard>
		<template #content>
			<UCard class="mt-1">
				<div class="flex flex-col gap-2">
					<div class="flex flex-row items-center justify-between">
						<SharedTextBaseSecondary>In cart:</SharedTextBaseSecondary>
						<SharedTextBaseSecondary>{{ count }}</SharedTextBaseSecondary>
					</div>
					<div class="flex flex-row items-center justify-between">
						<SharedTextBaseSecondary>Adjusted:</SharedTextBaseSecondary>
						<SharedIncrementDecrementPill :count="props.countAdjustment" :min="-count" :max="0" @increment="increment" @decrement="decrement" />
					</div>
					<USeparator />
					<div class="flex flex-row items-center justify-between">
						<SharedTextBaseSecondary>Count after Deals:</SharedTextBaseSecondary>
						<SharedTextBaseSecondary>{{ finalCount.count }}</SharedTextBaseSecondary>
					</div>
				</div>
			</UCard>
		</template>
	</UCollapsible>
</template>

<script setup>
const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	count: { type: Number, default: 0 },
	countAdjustment: { type: Number, default: 0 },
})

const isOpen = ref(false)

const emit = defineEmits(["update:modelValue"])

const increment = () => {
	emit("update:modelValue", props.countAdjustment + 1)
}

const decrement = () => {
	emit("update:modelValue", props.countAdjustment - 1)
}

const finalCount = computed(() => {
	return cartItemCountAdjustment({
		count: props.count,
		countAdjustment: props.countAdjustment,
		...(!isEmptyObject(props.itemDeal) ? { Item: { Deal: props.itemDeal } } : {}),
	})
})
</script>
