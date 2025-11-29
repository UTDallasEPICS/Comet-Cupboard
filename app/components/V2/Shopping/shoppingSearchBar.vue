<template lang="pug">
div.relative.w-64
  // Search bar container
  div.bg-white.w-full.h-8.rounded-xl.flex.items-center.border.border-gray-300.transition-all.duration-50(
    class="focus-within_border-blue-400 focus-within_drop-shadow-standard"
  )
    // Inline magnifying glass icon
    svg.w-5.h-5.pl-2.text-cupboardv2-dg(
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    )
      circle(cx="11" cy="11" r="8")
      line(x1="21" y1="21" x2="16.65" y2="16.65")

    input.w-full.bg-transparent.outline-none.border-none.text-base.font-bold.text-cupboardv2-dg.pl-2(
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

    div(
      v-for="item in filteredResults"
      :key="item.name"
      class="p-2 cursor-pointer hover:bg-gray-100 rounded"
      @click="selectItem(item)"
    )
      | {{ item.name }}
</template>

<script lang="ts" setup>
// Define a type for the items
interface CategoryItem {
  name: string
}

// Props
const props = defineProps<{
  modelValue: string
  categoryItems: CategoryItem[]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

// State
const searchTerm = ref(props.modelValue)
const isFocused = ref(false)

// Filtered results
const filteredResults = computed<CategoryItem[]>(() => {
  const q = searchTerm.value.toLowerCase().trim()
  if (!q) return props.categoryItems
  return props.categoryItems.filter(item =>
    item.name.toLowerCase().includes(q)
  )
})

// When user selects an item
function selectItem(item: CategoryItem) {
  searchTerm.value = item.name
  emit("update:modelValue", item.name)
  isFocused.value = false
}

// Keep dropdown alive briefly after blur
function onBlur() {
  setTimeout(() => {
    isFocused.value = false
  }, 150)
}

// Sync v-model → internal searchTerm
watch(() => props.modelValue, (val) => {
  searchTerm.value = val
})

// Sync internal searchTerm → parent v-model
watch(searchTerm, (val) => {
  emit("update:modelValue", val)
})
</script>
