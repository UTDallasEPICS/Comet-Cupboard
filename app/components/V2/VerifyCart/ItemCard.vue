<template lang="pug">
div.bg-utd-gray-v2.h-36.drop-shadow-standard.px-2.py-1.rounded-lg.flex.justify-between.items-center
    img(:src="`/api/image/${imgName}`").min-w-24.max-w-24.aspect-square
    div.mx-1.flex.flex-col.gap-y-0.w-full.leading-none.font-sans.mx-0
        span.text-left.ml-1 {{ name }}
        div.border-black.border-t
        div.flex.flex-row.justify-between
            span.text-left.ml-1 Total QTY
            span.text-right.h-full.mr-1 {{ totalQTY }}
        div.flex.flex-row.justify-between 
            span.text-left.ml-1 Deals
            span(v-if="dealCount != 0").text-right.h-full.mr-1 {{ -dealCount }}  
        div.flex.flex-row.justify-between
            span.text-left.ml-1 Expired
            span(v-if="expiredCount != 0").text-right.h-full.mr-1 {{ -expiredCount }}
        div.border-black.border-t
        div.flex.flex-row.justify-between
            span.text-left.ml-1 Adjusted QTY
            span.text-right.h-full.mr-1 {{ adjustedQTY }}
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