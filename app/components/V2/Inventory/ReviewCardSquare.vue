<template lang="pug">
div.bg-white.h-64.rounded-xl.flex.flex-col.items-center.gap-3.justify-top.drop-shadow-standard.relative
	// Image container
	div.relative.w-32.h-32.flex-shrink-0.overflow-hidden.mt-4
		img(:alt="itemName" :src="`/api/image/${imgName}`").w-full.h-full.object-cover
		PhotoIcon.w-full.h-full.txt-cupboardv2-dg
	// Text container (flex vertical)
	div.flex.flex-col.items-center.gap-4
		// Item name and in stock
		p.text-2xl.font-semibold {{ itemName }}
	p.text-xl.absolute.left-8.bottom-6 Count: {{ adjustedCount }}
	p.text-xl.font-bold.absolute.right-8.bottom-6 {{ changeInCount }}
</template>

<script lang="ts" setup>
import { PhotoIcon } from "@heroicons/vue/24/outline"

const props = defineProps({
	itemName: {
		type: String,
		default: "Item name",
	},
	itemCount: {
		type: Number,
		default: "#",
	},
	adjustedCount: {
		type: Number,
		default: "+??",
	},
	imgName: {
		type: String,
		default: "",
	},
})

const changeInCount = computed(() => {
	const dif = props.adjustedCount - props.itemCount
	return dif > 0 ? `+${dif}` : `${dif}`
})
</script>
