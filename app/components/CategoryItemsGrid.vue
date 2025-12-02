<template lang="pug">
div
	button(
		@click="show = !show"
	).bg-utd-orange.text-white.text-lg.font-semibold.flex.flex-row.justify-between.items-center.rounded-lg.px-4.py-1.h-8.w-72.cursor-pointer
		p {{ headingName }}
		ChevronDownIcon(v-if="!show").size-8.fill-white.stroke-white
		ChevronUpIcon(v-if="show").size-8.fill-white.stroke-white
	TransitionsDropDown
		div(v-if="show" style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").grid.gap-4.place-items-center.mt-1
			slot
</template>

<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	headingName: {
		type: String,
		required: true,
	},
})

// can't have transitions on initial render
const show = ref<boolean>(false)

onMounted(() => {
	show.value = true
})
</script>
