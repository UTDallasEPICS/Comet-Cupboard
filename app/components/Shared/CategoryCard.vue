<template>
	<UButton
		:to="`/${variant == 'shopping' ? 'student' : 'volunteer'}/${variant}/${categoryName}`"
		class="border-border-soft h-20 w-full min-w-72 overflow-hidden border bg-white p-0 pl-2 shadow-md"
	>
		<div class="text-text-soft flex w-full min-w-32 flex-1 items-center px-4">
			<SharedTextBase class="font-semibold">{{ categoryName }}</SharedTextBase>
		</div>
		<div class="h-full w-40 min-w-20 shrink-0">
			<img :alt="categoryName" :src="`/api/public/image/${imgName}`" :style="clipStyle" class="h-full w-full object-cover" />
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
	imgName: {
		type: String,
		default: "",
	},
})

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = "clip-path: polygon(5% 0, 100% 0, 100% 100%, 0 100%)"
</script>
