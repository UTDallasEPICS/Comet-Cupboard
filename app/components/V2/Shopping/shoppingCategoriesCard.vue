<template>
	<!-- Entire card clickable -->
	<NuxtLink :to="`/v2/shopping/${categoryName}`" class="w-full">
		<button class="bg-white w-full h-20 rounded-xl flex items-stretch justify-between overflow-hidden pl-2 drop-shadow-standard">
			<!-- Left: Category Name -->
			<div class="flex items-center flex-1 px-4 w-full">
				<p class="text-base text-cupboardv2-dg font-normal">{{ categoryName }}</p>
			</div>

			<!-- Right: Image or HeroIcon -->
			<div class="relative w-48 h-full flex-shrink-0 overflow-hidden rounded-r-xl">
				<img v-if="imageSrc" class="w-full h-full object-cover" :src="imageSrc" :alt="categoryName" :style="clipStyle" />
				<PhotoIcon v-else class="w-full h-full text-cupboardv2-dg" />
			</div>
		</button>
	</NuxtLink>
</template>

<script lang="ts" setup>
import { PhotoIcon } from "@heroicons/vue/24/outline"

const props = defineProps({
	categoryName: { type: String, default: "Category name" },
	imageSrc: { type: String, default: "" },
})

const clipStyle = "clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)"
</script>
