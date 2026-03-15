<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #body>
			<div class="flex flex-col justify-end">
				<div class="flex flex-row justify-end gap-4">
					<SharedTextBase class="text-end">Quantity:</SharedTextBase>
					<div class="w-20">
						<SharedTextBase class="text-center">{{ props.count }}</SharedTextBase>
					</div>
				</div>
				<div class="flex flex-row justify-end gap-4">
					<SharedTextBase>Adjust Count:</SharedTextBase>
					<div class="w-20">
						<SharedTextBase class="text-center">{{ countAdjustment }}</SharedTextBase>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex flex-row justify-end gap-4">
				<SharedTextBase class="text-end">Final Count:</SharedTextBase>
				<div class="w-20">
					<SharedTextBase class="text-center">{{ finalCount.count }}</SharedTextBase>
				</div>
			</div>
		</template>
	</SharedItemCard>
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
const finalCount = computed(() => {
	return cartItemCountAdjustment({
		count: props.count,
		countAdjustment: props.countAdjustment,
		...(!isEmptyObject(props.itemDeal) ? { Item: { Deal: props.itemDeal } } : {}),
	})
})
</script>
