<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #body>
			<div class="flex flex-col justify-end">
				<div class="flex flex-row justify-end gap-4">
					<SharedTextBase>Current Qty:</SharedTextBase>
					<div class="w-20">
						<SharedTextBase class="text-center">{{ quantity }}</SharedTextBase>
					</div>
				</div>
				<div class="flex flex-row justify-end gap-4">
					<SharedTextBase>Change:</SharedTextBase>
					<div class="w-20">
						<SharedTextBase class="text-center">{{ changeCount }}</SharedTextBase>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex flex-row justify-end gap-4">
				<SharedTextBase class="text-end">Final Qty:</SharedTextBase>
				<div class="w-20">
					<SharedTextBase class="text-center">{{ quantity + changeCount }}</SharedTextBase>
				</div>
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
