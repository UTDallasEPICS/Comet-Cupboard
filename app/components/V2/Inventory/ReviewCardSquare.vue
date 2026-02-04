<template>
	<div class="drop-shadow-standard relative flex h-64 w-full max-w-sm flex-col items-center rounded-xl bg-white">
		<!-- Image container -->
		<div class="relative mt-4 h-20 w-20 flex-shrink-0 overflow-hidden">
			<img :alt="itemName" :src="`/api/image/${imgName}`" class="h-full w-full object-cover" />
			<PhotoIcon class="text-cupboardv2-dg h-full w-full" />
		</div>
		<!-- Text container (flex vertical) -->
		<div class="flex flex-col items-center gap-4">
			<!-- Item name and in stock -->
			<p class="text-2xl font-semibold">{{ itemName }}</p>
			<p class="text-xl">Count: {{ adjustedCount }}</p>
			<p class="text-xl font-bold">{{ changeInCount }}</p>
		</div>
	</div>
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
