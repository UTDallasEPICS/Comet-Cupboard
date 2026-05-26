<template>
	<component :is="props.as" class="text-final-text-soft text-4xl font-bold tracking-tight md:text-6xl">
		<slot />
	</component>
</template>

<script setup lang="ts">
const props = defineProps({
	as: {
		type: String,
		required: false,
		default: "h1",
	},
})
</script>
