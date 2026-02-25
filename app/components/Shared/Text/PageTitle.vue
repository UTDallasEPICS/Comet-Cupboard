<template>
	<component :is="props.as" class="text-final-text-soft text-3xl font-bold tracking-tight md:text-4xl">
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
