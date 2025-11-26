<template lang="pug">
div.relative.w-full.max-w-xl.flex-grow
    // Search bar container
    div.bg-white.w-full.h-8.rounded-xl.flex.items-center.border.border-gray-300.transition-all.duration-50(
        class="focus-within_border-blue-400 focus-within_drop-shadow-standard"
    )
        MagnifyingGlassIcon.w-6.h-6.stroke-2.pl-2.text-cupboardv2-dg
        input.w-full.bg-transparent.outline-none.border-none.text-base.text-cupboardv2-dg.pl-2(
            type="text"
            placeholder="Search Item"
            v-model="searchTerm"
            @focus="isFocused = true"
            @blur="onBlur"
        )
    // Dropdown suggestions
    div.absolute.bg-white.border.border-gray-300.rounded-xl.drop-shadow-standard.w-full.mt-1.max-h-64.overflow-y-auto.z-10(
        v-if="isFocused && searchTerm"
    )
        div(v-if="filteredResults.length === 0")
            p.p-2.text-center.text-cupboardv2-dg No Results
        div(v-for="item in filteredResults" :key="item.id" class="p-2 cursor-pointer hover:bg-gray-100 rounded" @click="selectItem(item)")
            | {{ item.name }}
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

watch(() => props.categoryItems, (newItems) => {
    fuse.value = new Fuse(newItems, {
        keys: ["name"],
        threshold: 0.3
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
