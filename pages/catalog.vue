<template lang="pug">
div.flex.flex-row
    CategorySidebar(class="hidden lg:block")
    div.w-screen
        SearchBanner
        div.flex.flex-row.justify-end 
            SortingOptions
        ItemsGrid(class="grid-cols-2 lg:grid-cols-4")
</template>

<script lang="ts" setup></script>
