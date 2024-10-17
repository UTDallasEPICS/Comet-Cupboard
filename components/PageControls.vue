<template lang="pug">
    div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
        div.flex.flex-col.md_flex-row.md_space-x-5( v-if="type === 'SHOPPING' | type === 'INVENTORY'" )
            div.flex.relative
                Listbox( multiple )
                    ListboxButton.button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                        | Filters
                    ListboxOptions( class="max-h-[600px] md_max-h-96" ).absolute.top-14.z-10.bg-white.drop-shadow-standard.rounded-xl.w-full.divide-y.divide-cupboard-lg.overflow-y-scroll.no-scrollbar
                        ListboxOption.text-center.rounded-t-xl.bg-utd-green.text-white.text-2xl.font-bold.py-2
                            | Deals
                        ListboxOption( @click="handleFilter('Deals')" ).flex.flex-row.p-1.text-center.text-xl.cursor-pointer.hover_bg-cupboard-lg
                            div.flex.px-2
                                div.relative.w-6.h-6.place-self-center.rounded-md.bg-utd-green
                                    CheckIcon( v-if="options.filters.indexOf('Deals') != -1" ).absolute.inset-0.pointer-events-none.fill-white.stroke-white.h-6
                            div.grow
                                | Deals
                        ListboxOption.text-center.bg-utd-green.text-white.text-2xl.font-bold.py-2
                            | Categories 
                        // FIXME jumps to top of scroll sometimes (seems to occur every other click?)
                        ListboxOption( v-for="filter in filters" @click="handleFilter(filter.name)" ).flex.flex-row.p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
                            div.flex.px-2
                                div.relative.w-6.h-6.place-self-center.rounded-md.bg-utd-green
                                    CheckIcon( v-if="options.filters.indexOf(filter.name) != -1" ).absolute.inset-0.pointer-events-none.fill-white.stroke-white.h-6
                            div.grow
                                | {{filter.name}}
            div( v-if="type === 'INVENTORY'" ).max-md_order-first.flex.flex-row.space-x-5.max-md_pb-3
                div.flex.grow.relative
                    Listbox()
                        ListboxButton.button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                            // default, shown when no source
                            div( v-if="options.source === ''" )
                                | Source
                            // handle different sizes of source names being shown in the button
                            div( v-else-if="options.source.length > 20" ).text-wrap.text-sm
                                | {{options.source}}
                            div( v-else-if="options.source.length > 10" ).text-wrap.text-base
                                | {{options.source}}
                            div( v-else )
                                | {{options.source}}
                        ListboxOptions( class="max-h-[600px] md_max-h-96" ).absolute.top-14.z-10.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-96.divide-y.divide-cupboard-lg.overflow-y-scroll.no-scrollbar
                            ListboxOption( v-for="source in sources" @click="handleSource(source.name)" ).p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
                                | {{source.name}}
                button( @click="handleAdd" ).button.flex.w-40.md_w-12.bg-utd-green.text-white.place-content-center.place-items-center
                    PlusIcon.fill-white.stroke-white.h-7
        div.relative.flex.grow
            input( v-model="options.searchTerm" placeholder="Search" ).input.pl-10.w-full
            MagnifyingGlassIcon.absolute.left-0.bottom-3.h-7.fill-black
</template>

<script lang="ts" setup>

import { PlusIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/vue/24/solid'
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

/* const filters = [
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
]; */
const { data: filters } = await useFetch("/api/page-controls/categories")
function handleFilter( filterName ) {
    let pos = options.filters.indexOf(filterName);
    if (pos == -1) {
        options.filters.push(filterName);
    }
    else {
        options.filters.splice(pos, 1);
    }
}

// const sources = ["NTFB", "Community Garden", "Raising Cans", "Individual Donation"];
const { data: sources } = await useFetch("/api/page-controls/sources")
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
