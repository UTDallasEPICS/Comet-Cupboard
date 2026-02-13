<template>
	<component :is="props.as" class="text-sm text-final-text-soft leading-normal">
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
