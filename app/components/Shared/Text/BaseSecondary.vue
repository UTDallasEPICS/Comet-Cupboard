<template>
	<component :is="props.as" class="text-text-soft text-sm leading-normal break-words whitespace-normal">
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
