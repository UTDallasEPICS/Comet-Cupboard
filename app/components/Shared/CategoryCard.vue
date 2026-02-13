<template>
	<UButton :to="`/${variant}/${categoryName}`" class="border-final-border-soft h-20 w-full min-w-72 overflow-hidden border bg-white p-0 pl-2 shadow-md">
		<div class="text-final-text-soft flex w-full min-w-32 flex-1 items-center px-4">
			<p>{{ categoryName }}</p>
		</div>
		<div class="h-full w-48 min-w-20 shrink-0">
			<img :alt="categoryName" :src="imageSrc" :style="clipStyle" class="h-full w-full object-cover" />
		</div>
	</UButton>
</template>

<script lang="ts" setup>
import type { PropType } from "vue"

const props = defineProps({
	variant: {
		type: String as PropType<"shopping" | "inventory">,
		required: true,
	},
	categoryName: {
		type: String,
		required: true,
	},
	imageSrc: {
		type: String,
		default: "",
	},
})

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = "clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)"
</script>
