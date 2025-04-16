<template lang="pug">
div.relative.flex.grow
	Combobox(nullable v-model="searchTerm")
		ComboboxInput(placeholder="Search" @change="searchTerm = $event.target.value.trim()" :displayValue="(searchTerm) => searchTerm").input.pl-10.w-full
		ComboboxButton.absolute.left-0.top-3.remove-button-effects
			MagnifyingGlassIcon.h-7.fill-black
		button(@click="clear").absolute.right-0.top-3.remove-button-effects
			XMarkIcon.h-7.fill-black
		// list filtered results (filtered in prisma api call)
		TransitionsDropDown
			ComboboxOptions.absolute.top-14.z-10.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-96.divide-y.divide-cupboard-lg.overflow-y-scroll.overscroll-contain
				div(
					v-if="filteredResults.length === 0 || (filteredResults.length === 0 && searchTerm != '')"
				).p-1.text-center.text-2xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
					| No Results
				ComboboxOption(v-for="result in filteredResults" :key="result.name" :value="result.name").p-1.px-10.text-2xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
					| {{ result.name }}
</template>

<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from "@headlessui/vue"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/solid"

const emit = defineEmits(["searchTermChange"])

const searchTerm = ref("")
const { data: holder } = await useFetch("/api/controls/filteredItems", {
	query: { term: searchTerm.value !== null && searchTerm.value !== "" ? searchTerm.value : null },
}) //Holds all the items to be displayed when the search term is empty
// const filteredResults = ref([])

const filteredResults = computed(() => {
	//If the search term is empty, reset the filtered results to the holder value
	if (searchTerm.value === null || searchTerm.value === "") {
		return holder.value || []
	}
	return holder.value.filter((item) => item.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

// emit searchTerm changes
watch(searchTerm, (newValue) => {
	// return id of the searched for entry
	emit("searchTermChange", searchTerm.value)
})

const clear = () => {
	searchTerm.value = ""
}
</script>
