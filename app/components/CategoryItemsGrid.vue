<template lang="pug">
div
	div(
		@click="show = !show"
	).bg-utd-orange.text-white.text-xl.font-semibold.flex.flex-row.justify-between.items-center.rounded-2xl.px-4.py-2.cursor-pointer.hover_drop-shadow-standard
		p {{ headingName }}
		ChevronDownIcon(v-if="!show").size-8.fill-white.stroke-white
		ChevronUpIcon(v-if="show").size-8.fill-white.stroke-white
	TransitionsDropDown
		div(v-if="show" style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").my-4.grid.place-items-center.gap-4
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
