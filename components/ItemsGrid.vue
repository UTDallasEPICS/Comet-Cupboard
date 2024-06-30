<template lang="pug">
div.grid.gap-4.p-4
    ItemCard(v-for="item in items" :name="item.name" :imgURL="item.imgURL")
</template>

<script lang="ts" setup>
const { data: items } = await useFetch("/api/items")
</script>
