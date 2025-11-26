<template lang="pug">
div.relative.w-full.max-w-xl.flex-grow
	// Search bar container
	div.bg-white.focus-within_border-blue-400.focus-within_drop-shadow-standard.w-full.h-8.rounded-xl.flex.items-center.border.border-gray-300.transition-all.duration-50
		MagnifyingGlassIcon.w-6.h-6.stroke-2.pl-2
		input(
			placeholder="Search Item"
			type="text"
			v-model="searchTerm"
			@blur="onBlur"
			@focus="isFocused = true"
		).w-full.bg-transparent.outline-none.border-none.text-base.pl-2
	// Dropdown suggestions
	div(v-if="isFocused && searchTerm").absolute.bg-white.border.border-gray-300.rounded-xl.drop-shadow-standard.w-full.mt-1.max-h-64.overflow-y-auto.z-10
		div(v-if="filteredResults.length === 0")
			p.p-2.text-center No Results
		div(v-for="item in filteredResults" :key="item.id" class="hover:bg-gray-100" @click="selectItem(item)").p-2.cursor-pointer.rounded
			| {{ item.name }}
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline"
import Fuse from "fuse.js"
import { useFetch } from "#app"

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	categoryItems: {
		type: Array,
		default: () => [],
	},
})

const emit = defineEmits(["update:modelValue"])
const searchTerm = ref(props.modelValue)
const isFocused = ref(false)
const items = ref([])
const fuse = ref<Fuse<any>>()

watch(
	() => props.categoryItems,
	(newItems) => {
		fuse.value = new Fuse(newItems, {
			keys: ["name"],
			threshold: 0.6,
		})
	},
	{ immediate: true }
)

// Function to navigate to a card when the dropdown item is clicked
function selectItem(item) {
	searchTerm.value = item.name
	emit("update:modelValue", item.name)
	isFocused.value = false
}

// Fuzzy search results
const filteredResults = computed(() => {
	if (!searchTerm.value) return props.categoryItems
	return fuse.value?.search(searchTerm.value).map((r) => r.item) || []
})

// Emit search term changes
watch(searchTerm, (val) => emit("update:modelValue", val))

watch(
	() => props.modelValue,
	(val) => {
		searchTerm.value = val
	}
)

// Ensure dropdown stays open briefly on blur to allow clicks
function onBlur() {
	setTimeout(() => {
		isFocused.value = false
	}, 150)
}
</script>
