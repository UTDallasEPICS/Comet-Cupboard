<template lang="pug">
div
    div
        PageControls( type="INVENTORY" @controlsChange="(options) => getControls(options)" @addItemClick="addItemsOpen = !addItemsOpen" )
        div.flex.flex-row.space-x-20
            div
                | filters = {{filters}}
            div
                | source = {{source}}
            div
                | searchterm = {{searchTerm}}
            div.flex.flex-row.items-center.justify-center
        p( v-if="addItemsOpen" ).text-center.pt-20 Add Items
        p.text-center.pt-20 donations
</template>

<script lang="ts" setup>

const searchTerm = ref("");
const filters = ref([]);
const source = ref("");

function getControls(options) {
    searchTerm.value = options.searchTerm;
    filters.value = options.filters; 
    source.value = options.source;
}

const addItemsOpen = ref(false);

</script>
