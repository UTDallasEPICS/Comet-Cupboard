<template lang="pug">
div.flex.relative
	Listbox(multiple v-model="selectedFilters" v-slot="{ open }")
		ListboxButton.flex.flex-row.w-full.md_w-44.bg-utd-orange.text-white.px-4.text-left.items-center
			div.grow.overflow-x-hidden
				| Filters
			ChevronUpIcon(v-if="open").fill-white.stroke-white.h-7
			ChevronDownIcon(v-else).fill-white.stroke-white.h-7
		TransitionsDropDown
			ListboxOptions(
				class="max-h-[600px]"
			).md_max-h-96.absolute.top-14.z-30.bg-white.drop-shadow-standard.rounded-xl.w-full.divide-y.divide-cupboard-lg.overflow-y-scroll.overflow-x-hidden.overscroll-contain
				ListboxOption(disabled).text-center.rounded-t-xl.bg-utd-green.text-white.text-2xl.font-bold.py-2
					| Deals
				ListboxOption(value="Deals").flex.flex-row.p-1.text-center.text-xl.cursor-pointer.hover_bg-cupboard-lg
					div.flex.px-2
						div.relative.w-6.h-6.place-self-center.rounded-md.bg-utd-green
							CheckIcon(v-show="selectedFilters.indexOf('Deals') != -1").absolute.inset-0.pointer-events-none.fill-white.stroke-white.h-6
					div.grow
						| Deals
				ListboxOption(disabled).text-center.bg-utd-green.text-white.text-2xl.font-bold.py-2
					| Categories
				ListboxOption(
					v-for="filter in categories"
					:key="filter.name"
					:value="filter.name"
				).flex.flex-row.p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
					div.flex.px-2
						div.relative.w-6.h-6.place-self-center.rounded-md.bg-utd-green
							CheckIcon(v-if="selectedFilters.indexOf(filter.name) != -1").absolute.inset-0.pointer-events-none.fill-white.stroke-white.h-6
					div.grow
						| {{ filter.name }}
</template>

<script lang="ts" setup>
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"

const emit = defineEmits(["filterChange"])

const selectedFilters = ref([])

const { data: categories } = await useFetch("/api/controls/categories")

// emit filter changes
watch(selectedFilters, () => {
	emit("filterChange", selectedFilters.value)
})
</script>
