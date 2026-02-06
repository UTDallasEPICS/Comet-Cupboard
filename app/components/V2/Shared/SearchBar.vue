<template>
	<div class="relative w-full max-w-xl flex-grow">
		<!-- Search bar container -->
		<div
			class="focus-within:drop-shadow-standard flex h-8 w-full items-center rounded-xl border border-gray-300 bg-white transition-all duration-50 focus-within:border-blue-400"
		>
			<MagnifyingGlassIcon class="text-cupboardv2-dg h-6 w-6 stroke-2 pl-2" />
			<input
				type="text"
				placeholder="Search Item"
				v-model="searchTerm"
				@focus="isFocused = true"
				@blur="onBlur"
				class="w-full border-none bg-transparent pl-2 outline-none"
			/>
		</div>
		<!-- Dropdown suggestions -->
		<div
			v-if="isFocused && searchTerm"
			class="drop-shadow-standard absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white"
		>
			<div v-if="filteredResults.length === 0">
				<p class="text-cupboardv2-dg p-2 text-center">No Results</p>
			</div>
			<div v-for="item in filteredResults" :key="item.id" class="cursor-pointer rounded p-2 hover:bg-gray-100" @click="selectItem(item)">
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
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
    }
})

const emit = defineEmits(["update:modelValue"])
const searchTerm = ref(props.modelValue)
const isFocused = ref(false)
const items = ref([])
const fuse = ref<Fuse<any>>()

// Pop to whats popping up in index
watch(() => props.categoryItems, (newItems) => {
    fuse.value = new Fuse(newItems, {
        keys: ["name"],
        threshold: 0.6
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
    return fuse.value?.search(searchTerm.value).map(r => r.item) || []
})

// Emit search term changes
watch(searchTerm, val => emit("update:modelValue", val))

watch(() => props.modelValue, val => {
    searchTerm.value = val
})

// Ensure dropdown stays open briefly on blur to allow clicks
function onBlur() {
    setTimeout(() => {
        isFocused.value = false
    }, 150)
}
</script>
