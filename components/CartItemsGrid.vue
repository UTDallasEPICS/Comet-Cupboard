<template lang="pug">
div.grid.gap-4.p-4
    CartItemCard(v-for="item in [1, 2, 3, 4, 5, 6]")
</template>

<script lang="ts" setup>
const { data: items } = await useFetch("/api/inventory/items")
</script>
