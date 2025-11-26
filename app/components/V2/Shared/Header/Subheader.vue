<template lang="pug">
div.bg-utd-orange.h-16.w-full.flex.items-center.justify-center
	p.text-3xl.font-bold.text-white {{ pageTitle }}
</template>

<script lang="ts" setup>
const props = defineProps({
	pageTitle: {
		type: String,
		default: "Page Title",
	},
})
</script>
