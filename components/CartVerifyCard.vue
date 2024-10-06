<template lang="pug">
p.text-center.text-xl {{ name }}
	div.w-72.flex.flex-row.border-black.border-t-2.pt-1
		img.aspect-square.w-24.rounded-xl.border-black.border-2(:src="imgURL" :alt="name")
		div.flex.flex-col.justify-evenly.w-full.text-xl
			div.px-1.flex.flex-row.justify-between
				span.leading-none.text-left.my-auto Total QTY
				span.leading-none.text-right.my-auto {{ totalQTY }}
			div.px-1.flex.flex-row.justify-between
				span.leading-none.text-left.my-auto Deals
				span.leading-none.text-right.my-auto {{ dealsCount }}
			div.px-1.flex.flex-row.justify-between
				span.leading-none.text-left.my-auto Expired
				span.leading-none.text-right.my-auto {{ expiredCount }}
			div.px-1.flex.flex-row.justify-between.border-black.border-t-2
				span.leading-none.text-left.my-auto Adjusted QTY
				span.leading-none.text-right.my-auto {{ adjustedQTY }}
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
