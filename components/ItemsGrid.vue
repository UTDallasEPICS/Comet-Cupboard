<template lang="pug">
div.grid.gap-4.p-4.grid.place-items-center.gap-4(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))")
    ItemCard(v-for="item in items" :name="item.name" :imgURL="item.imgURL" :itemID="item.itemID")
</template>

<script lang="ts" setup>
const { data: items } = await useFetch("/api/inventory/items")
</script>
