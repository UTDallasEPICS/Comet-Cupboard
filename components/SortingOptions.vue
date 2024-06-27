<template lang="pug">
Listbox(v-model="selectedSort")
    div.relative.w-72.text-right.text-white.text-3xl.whitespace-nowrap
        ListboxButton 
            div.bg-neutral-500
                p {{ selectedSort }}
        ListboxOptions
            div.absolute.right-0.flex.flex-col.items-center.pb-4.gap-4(style="background-color: #8A7A67")
                ListboxOption(v-for="option in sortingOptions" :key="option" :value="option") {{ option }}
</template>

<script lang="ts" setup>
import { Listbox, ListboxLabel, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

const sortingOptions = ["Sort (none)", "Sort (alphabetical)", "Sort (popularity)"]
const selectedSort = ref(sortingOptions[0])
</script>
