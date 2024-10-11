<template lang="pug">
    div.space-x-3
        button.button.bg-utd-orange.text-white.px-4
            | Filter
        button.button.bg-utd-orange.text-white.px-4
            | Source
        button.button.bg-utd-green.text-white.px-4
            | +
        input( v-model="options.searchTerm" placeholder="Search" ).input
</template>

<script lang="ts" setup>
const props = defineProps({
    type: String
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
