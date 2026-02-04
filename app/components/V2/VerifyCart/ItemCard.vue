<template>
	<div class="bg-utd-gray-v2 border-outlining-gray-v2 flex h-36 items-center justify-between rounded-lg border px-2 py-1">
		<div class="relative aspect-square max-w-24 min-w-24">
			<img :src="`/api/image/${imgName}`" />
			<div v-if="dealExists" class="bg-utd-orange absolute top-0 left-0 w-16 rounded-br-lg px-1">
				<p class="text-center text-sm text-white">{{ dealText }}</p>
			</div>
		</div>
		<div class="mx-0 mx-1 flex w-full flex-col gap-y-0 leading-none">
			<p class="ml-1 text-left">{{ name }}</p>
			<div class="border-t border-black"></div>
			<div class="flex flex-row justify-between">
				<p class="ml-1 text-left">Total QTY</p>
				<p class="mr-1 h-full text-right">{{ totalQTY }}</p>
			</div>
			<div class="flex flex-row justify-between">
				<p class="ml-1 text-left">Deals</p>
				<p v-if="dealCount != 0" class="mr-1 h-full text-right">{{ -dealCount }}</p>
			</div>
			<div class="flex flex-row justify-between">
				<p class="ml-1 text-left">Expired</p>
				<p v-if="expiredCount != 0" class="mr-1 h-full text-right">{{ -expiredCount }}</p>
			</div>
			<div class="border-t border-black"></div>
			<div class="flex flex-row justify-between">
				<p class="ml-1 text-left">Adjusted QTY</p>
				<p class="mr-1 h-full text-right">{{ adjustedQTY }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgName: {
		type: String,
		required: true,
	},
	itemID: {
		type: String,
		required: true,
	},
	itemDeal: {
		type: Object,
		required: false,
		default: () => {
			return {}
		},
	},
	totalQTY: {
		type: Number,
		required: true,
	},
	dealCount: {
		type: Number,
		required: true,
	},
	expiredCount: {
		type: Number,
		required: true,
	},
	adjustedQTY: {
		type: Number,
		required: true,
	},
})

const dealExists = computed(() => {
	return Object.keys(props.itemDeal).includes("actualCount") && Object.keys(props.itemDeal).includes("adjustedCount")
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	if (props.itemDeal.actualCount == 1 && props.itemDeal.adjustedCount == 0) {
		return "FREE"
	}
	return `${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`
})
</script>
