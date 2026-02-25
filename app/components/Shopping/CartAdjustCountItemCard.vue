<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #body>
			<div class="mt-auto grid grid-cols-2 items-end gap-2">
				<SharedTextBase class="text-end">QTY after Deals:</SharedTextBase>
				<SharedTextBase class="text-center">{{ props.count }}</SharedTextBase>
				<SharedTextBase class="text-end">Adjust Count:</SharedTextBase>
				<div class="flex justify-center">
					<UInputNumber
						v-model="countAdjustment"
						placeholder="0"
						:min="props.count * -1"
						:max="0"
						:increment="false"
						:decrement="false"
						class="w-12"
						:ui="{
							base: 'text-center',
						}"
						@blur="emit('update:modelValue', countAdjustment)"
					/>
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

const emit = defineEmits(["update:modelValue"])
const countAdjustment = ref(0)
</script>
