<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #header-actions>
			<UButton variant="ghost" icon="i-heroicons-x-mark" class="shrink-0" size="xs" @click="removeCartItem" />
		</template>
		<template #body>
			<div class="mt-auto grid grid-cols-2 items-end gap-2">
				<SharedTextBase class="text-end">QTY after Deals:</SharedTextBase>
				<SharedTextBase class="text-center">{{ props.count }}</SharedTextBase>
				<SharedTextBase class="text-end">Adjust Count:</SharedTextBase>
				<div class="flex justify-center items-end gap-1">
					<UButton icon="i-heroicons-minus" size="xs" variant="soft" :disabled="countAdjustment * -1 == props.count" @click="decrement" />
					<SharedTextBase class="w-8 text-center">{{ countAdjustment }}</SharedTextBase>
					<UButton icon="i-heroicons-plus" size="xs" variant="soft" :disabled="countAdjustment >= 0" @click="increment" />
				</div>
                <SharedTextBase class="text-end">Final Count:</SharedTextBase>
                <SharedTextBase class="text-center">{{ props.count + countAdjustment }}</SharedTextBase>
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
})

const countAdjustment = ref(0)

const increment = () => {
	countAdjustment.value++
}

const decrement = () => {
	countAdjustment.value--
}
</script>
