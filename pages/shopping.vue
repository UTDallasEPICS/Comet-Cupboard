<template lang="pug">
div.flex.flex-row
    CategorySidebar(class="hidden invisible lg:flex lg:visible")
    div.w-screen
        PageControls( type="SHOPPING" )
        //- div.flex.flex-row(class="justify-center sm:justify-end sm:pr-4")
        //-     CategoryOptions(class="flex visible lg:hidden lg:invisible")
        ItemsGrid(class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5")
</template>

<script lang="ts" setup></script>
