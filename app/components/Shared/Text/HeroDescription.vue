<template>
	<component :is="props.as" class="text-lg text-final-text-soft md:text-xl">
		<slot />
	</component>
</template>

<script setup lang="ts">
const props = defineProps({
	as: {
		type: String,
		required: false,
		default: "p",
	},
})
</script>
