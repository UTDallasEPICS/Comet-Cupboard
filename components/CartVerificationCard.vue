<template lang="pug">
div.text-xl
	p.text-center {{ name }}
	div.w-72.flex.flex-row.border-black.border-t.pt-1
		img.aspect-square.w-24.h-24.rounded-xl(:src="imgURL" :alt="name")
		div.mx-1.flex.flex-col.gap-y-1.justify-evenly.w-full.leading-none
			div.flex.flex-row.justify-between
				span.text-left Total QTY
				span.text-right {{ totalQTY }}
			div.flex.flex-row.justify-between
				span.text-left Deals
				span.text-right.text-red-negative(v-if="dealsCount != 0") {{ dealsCount }}
			div.flex.flex-row.justify-between
				span.text-left Expired
				span.text-right.text-red-negative(v-if="expiredCount != 0") {{ expiredCount }}
			div.border-black.border-t
			div.flex.flex-row.justify-between
				span.text-left Adjusted QTY
				span.text-right {{ adjustedQTY }}
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgURL: {
		type: String,
		required: true,
	},
	itemID: {
		type: String,
		required: true,
	},
	totalQTY: {
		type: Number,
		required: true,
	},
	dealsCount: {
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
</script>
