<template>
	<div class="drop-shadow-standard relative flex h-24 w-full items-center rounded-xl bg-white px-4">
		<!-- Image container -->
		<div class="relative h-16 w-16 flex-shrink-0 overflow-hidden">
			<img :alt="itemName" :src="`/api/image/${imgName}`" class="h-full w-full object-cover" />
			<PhotoIcon class="text-cupboardv2-dg h-full w-full" />
		</div>
		<!-- Text Container -->
		<div class="ml-4 flex flex-1 items-center justify-between">
			<!-- Item Name + Updated Count -->
			<div class="flex flex-col">
				<p class="text-lg font-semibold">{{ itemName }}</p>
				<p class="text-sm">Count: {{ adjustedCount }}</p>
			</div>
			<!-- Change in Count -->
			<p class="text-lg font-bold">{{ changeInCount }}</p>
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
		default: "??",
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
