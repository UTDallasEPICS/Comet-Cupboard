<template lang="pug">
    div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
        div.flex.flex-col.md_flex-row.md_space-x-5( v-if="type === 'SHOPPING' | type === 'INVENTORY'" )
            div.flex
                div.relative
                    Listbox( multiple )
                        ListboxButton.button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                            | Filters
                        ListboxOptions( anchor.to="bottom" anchor.gap="5" ).absolute.bg-white.drop-shadow-standard.rounded-xl.w-full.space-y-3.pt-2.pb-3
                            ListboxOption( ).text-center.border-b.bg-utd-green.text-white.text-xl.font-bold
                                | Deals
                            ListboxOption( @click="handleFilter('Deals')" ).text-center.border-b.cursor-pointer
                                | Deals
                            ListboxOption( ).text-center.border-b.bg-utd-green.text-white.text-xl.font-bold
                                | Categories 
                            ListboxOption( v-for="filter in filters" @click="handleFilter(filter)" ).text-center.border-b.cursor-pointer
                                | {{filter}}
            div( v-if="type === 'INVENTORY'" ).max-md_order-first.flex.flex-row.space-x-5.max-md_pb-3
                div.relative
                    Listbox()
                        ListboxButton.button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                            | Source
                        ListboxOptions( anchor.to="bottom" anchor.gap="5" ).absolute.bg-white.drop-shadow-standard.rounded-xl.w-full.space-y-3.pt-2.pb-3
                            ListboxOption( v-for="source in sources" @click="handleSource(source)" ).text-center.border-b.cursor-pointer
                                | {{source}}
                button( @click="handleAdd" ).button.flex.w-40.md_w-12.bg-utd-green.text-white.place-content-center.place-items-center
                    PlusIcon.fill-white.stroke-white.h-7
        div.relative.flex.grow
            input( v-model="options.searchTerm" placeholder="Search" ).input.pl-10.w-full
            MagnifyingGlassIcon.absolute.left-0.bottom-3.h-7.fill-black
</template>

<script lang="ts" setup>

import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

const emit = defineEmits(["controlsChange","addItemClick"]);

const props = defineProps({
    type: {
        type: String,
        required: true,
    }
});

// emit an object contiaing all info
const options = reactive({
    filters: [], 
    source: '', // need to pull sources from db to put in drop down
    searchTerm: '',
}); 

const filters = [
    "Snacks",
    "Grains",
    "Breakfast Grains",
    "Soup",
    "Protein",
    "Household Items",
    "Personal Care",
    "Fruits",
    "Vegetables",
    "Refrigerated Items",
    "Frozeon Items",
]; // hardcode for now, if nessesary pull db
// filter array will be unordered currently
function handleFilter( filterName ) {
    let pos = options.filters.indexOf(filterName);
    if (pos == -1) {
        options.filters.push(filterName);
    }
    else {
        options.filters.splice(pos, 1);
    }
}

const sources = ["NTFB", "Community Garden", "Raising Cans", "Individual Donation"];
function handleSource( sourceName ) {
    if ( options.source === sourceName ) {
        options.source = "";
    }
    else {
        options.source = sourceName;
    }
}

// emit the options when a control is changed
watch(options, () => {
    emit("controlsChange", options);
});

// emit when a add item is clicked
function handleAdd() {
    emit("addItemClick");
}
</script>
