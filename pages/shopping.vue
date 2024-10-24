<template lang="pug">
div.flex.flex-row
    // CategorySidebar(class="hidden invisible lg:flex lg:visible")
    div.w-screen
        div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
            div.flex.flex-col.md_flex-row.md_space-x-5
                ControlsFilter( @filterChange="(selectedFilters) => filters = selectedFilters" )
            div.flex.grow
                ControlsSearch( @searchTermChange="(newTerm) => searchTerm = newTerm" )
        //- div.flex.flex-row(class="justify-center sm:justify-end sm:pr-4")
        //-     CategoryOptions(class="flex visible lg:hidden lg:invisible")
        div.flex.flex-row(class="justify-center sm:justify-end sm:pr-4") 
            SortingOptions
        ItemsGrid
</template>

<script lang="ts" setup>

const searchTerm = ref("");
const filters = ref([]);

onMounted(async () => {
	await $fetch("/api/cart/cart", { method: "POST" })
})
</script>
