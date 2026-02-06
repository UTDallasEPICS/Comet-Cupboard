<template>
	<NuxtLink
		:to="`/inventory/${categoryName}`"
		class="w-full bg-white h-20 rounded-xl flex items-stretch justify-between overflow-hidden pl-2 drop-shadow-standard"
	>
		<div class="flex items-center flex-1 px-4 w-full min-w-32">
			<p class="">{{ categoryName }}</p>
		</div>
		<div class="w-48 h-full flex-shrink-0 overflow-hidden min-w-20">
			<img
				:alt="categoryName"
				:src="imageSrc"
				:style="clipStyle"
				class="w-full h-full object-cover"
			/>
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
