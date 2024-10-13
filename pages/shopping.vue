<template lang="pug">
div.flex.flex-row
    CategorySidebar(class="hidden invisible lg:flex lg:visible")
    div.w-screen
        PageControls( type="SHOPPING" @controlsChange="(options) => getControls(options)" )
        //- div.flex.flex-row(class="justify-center sm:justify-end sm:pr-4")
        //-     CategoryOptions(class="flex visible lg:hidden lg:invisible")
        // ItemsGrid(class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5")
        div.flex.flex-row.space-x-20
            div
                | filters = {{filters}}
            div
                | searchterm = {{searchTerm}}
</template>

<script lang="ts" setup>

const searchTerm = ref("");
const filters = ref([]);

function getControls(options) {
    searchTerm.value = options.searchTerm;
    filters.value = options.filters; 
}
</script>
