<template lang="pug">
div.grid.grid-cols-4.gap-4.p-4
    ItemCard(v-for="item in items")
</template>

<script lang="ts" setup>
const { data: items } = await useFetch("/api/items")
</script>
