<template lang="pug">
NuxtLink.rounded-full.text-center.text-white.font-bold(style="background-color: #154734; padding: 10px 20px" :to="to")
    slot
</template>

<script setup lang="ts">
const props = defineProps<{ to: string }>()
</script>
