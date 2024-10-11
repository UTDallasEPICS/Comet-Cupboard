<template lang="pug">
    div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
        div.flex.flex-col.md_flex-row.md_space-x-5
            div.flex
                button( v-if="type === 'SHOPPING' | type === 'INVENTORY'" ).button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                    | Filter
            div( v-if="type === 'INVENTORY'" ).max-md_order-first.flex.flex-row.space-x-5.max-md_pb-3
                button.button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                    | Source
                button.button.flex.w-40.md_w-12.bg-utd-green.text-white.place-content-center.place-items-center
                    PlusIcon.fill-white.stroke-white.h-7
        div.relative.flex.grow
            input( v-model="options.searchTerm" placeholder="Search" ).input.pl-10.w-full
            MagnifyingGlassIcon.absolute.left-0.bottom-3.h-7.fill-black
</template>

<script lang="ts" setup>

import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    type: {
        type: String,
        required: true,
    }
});

const emit = defineEmits(["controlsChange","addItemClick"]);

// emit an object contiaing all info
const options = reactive({
    filters: [], 
    source: null, // need to pull sources from db to put in drop down
    searchTerm: '',
});

// emit the options when a control is changed
watch(options, () => {
    emit("controlsChange", options);
});

// const source = await useFetch("");

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

// emit when a add item is clicked
function handleAdd() {
    emit("addItemClick");
}
</script>
