<template lang="pug">
div
    div
        // page control components
        div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
            div.flex.flex-col.md_flex-row.md_space-x-5
                ControlsFilter( @filterChange="(selectedFilters) => filters = selectedFilters" )
                div.max-md_order-first.flex.flex-row.space-x-5.max-md_pb-3
                    ControlsSource( @sourceChange="(selectedSource) => source = selectedSource" ).max-md_order-first.max-md_pb-3
                    button( @click="addItemsOpen = !addItemsOpen" ).button.flex.w-24.md_w-12.bg-utd-green.text-white.place-content-center.place-items-center
                        PlusIcon.fill-white.stroke-white.h-7
            div.flex.grow
                ControlsSearch( @searchTermChange="(newTerm) => searchTerm = newTerm" )
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

import { PlusIcon } from '@heroicons/vue/24/solid'

const searchTerm = ref("");
const filters = ref([]);
const source = ref("");

const addItemsOpen = ref(false);

</script>
