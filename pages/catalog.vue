<template lang="pug">
div.flex.flex-row
    CategorySidebar(class="hidden invisible lg:block lg:visible")
    div.w-screen
        SearchBanner
        div.flex.flex-row(class="justify-center sm:justify-end sm:pr-4")
            CategoryOptions(class="block visible lg:hidden lg:invisible")
        div.flex.flex-row(class="justify-center sm:justify-end sm:pr-4") 
            SortingOptions
        ItemsGrid(class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5")
</template>

<script lang="ts" setup></script>
