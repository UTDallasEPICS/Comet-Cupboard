<template lang="pug">
div.text-xl.bg-white
	p.text-center {{ name }}
	div.w-72.flex.flex-row.border-black.border-t.pt-1
		img(:alt="name" :src="`api/image/${imgName}`").aspect-square.w-24.h-24.rounded-xl
		div(v-if="dealExists").absolute.bg-utd-orange.rounded-tl-md.w-16.px-1
			p.text-white.text-center.text-sm {{ dealText }}
		div.mx-1.flex.flex-col.gap-y-1.justify-evenly.w-full.leading-none
			div.flex.flex-row.justify-between
				span.text-left Total QTY
				span(class="px-1.5").text-right.h-full {{ totalQTY }}
			div.flex.flex-row.justify-between
				span.text-left Deals
				span(v-if="dealCount != 0" class="px-1.5").text-right.h-full.rounded.bg-yellow-warning {{ -dealCount }}
			div.flex.flex-row.justify-between
				span.text-left Expired
				span(v-if="expiredCount != 0" class="px-1.5").text-right.h-full.rounded.bg-yellow-warning {{ -expiredCount }}
			div.border-black.border-t
			div.flex.flex-row.justify-between
				span.text-left Adjusted QTY
				span(class="px-1.5").text-right.h-full {{ adjustedQTY }}
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
