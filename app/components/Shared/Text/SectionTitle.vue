<template>
	<component :is="props.as" class="text-text-soft text-2xl font-semibold md:text-3xl">
		<slot />
	</component>
</template>

<script setup lang="ts">
const props = defineProps({
	as: {
		type: String,
		required: false,
		default: "h2",
	},
})
</script>
