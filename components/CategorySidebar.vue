<template lang="pug">
div.flex.flex-col.gap-4.min-w-72.w-72.text-center.text-white.text-3xl.whitespace-nowrap(style="background-color: #154734")
    p.min-w-full.cursor-pointer(v-for="category in categories") {{ category }}

</template>

<script lang="ts" setup>
const categories = ref<Array<string>>(["All", "Pantry Staples", "Snacks", "Grains", "Breakfast Grains", "Soup", "Protein", "Household Items", "Personal Care", "Fruits", "Vegetables", "Refrigerated Items", "Frozen"])
</script>
