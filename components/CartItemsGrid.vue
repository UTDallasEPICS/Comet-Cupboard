<template lang="pug">
div.grid.gap-4.p-4
    CartItemCard(v-for="item in items")
</template>

<script lang="ts" setup>
const { data: items } = await useFetch("/api/items")
</script>
