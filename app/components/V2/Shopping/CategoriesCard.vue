<template>
	<NuxtLink
		:to="`/shopping/${categoryName}`"
		class="drop-shadow-standard flex h-20 w-full items-stretch justify-between overflow-hidden rounded-xl bg-white pl-2"
	>
		<div class="flex w-full min-w-32 flex-1 items-center px-4">
			<p class="">{{ categoryName }}</p>
		</div>
		<div class="h-full w-48 min-w-20 flex-shrink-0 overflow-hidden">
			<img :alt="categoryName" :src="imageSrc" :style="clipStyle" class="h-full w-full object-cover" />
		</div>
	</NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
    categoryName: {
        type: String,
        default: "Category name",
    },
    imageSrc: {
        type: String,
        default: "",
    },
})

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = "clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)"
</script>
