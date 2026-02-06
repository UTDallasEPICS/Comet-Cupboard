<template>
	<div class="bg-utd-orange flex h-16 w-full items-center justify-center">
		<p class="text-white">{{ pageTitle }}</p>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	pageTitle: {
		type: String,
		default: "Page Title",
	},
})
</script>
