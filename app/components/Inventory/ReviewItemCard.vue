<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #header-actions>
			<!-- <UButton variant="ghost" :icon="icons['close']" class="shrink-0" size="xs" @click="removeCartItem" /> -->
		</template>
		<template #body>
			<div class="mt-auto flex flex-col items-end gap-2">
				<SharedTextBase>Current Qty: {{ quantity }}</SharedTextBase>
				<SharedTextBase>Change: {{ changeCount }}</SharedTextBase>
			</div>
		</template>
	</SharedItemCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		default: "Item name",
	},
	imgName: {
		type: String,
		default: "",
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
	itemID: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		default: 0,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
})
</script>
