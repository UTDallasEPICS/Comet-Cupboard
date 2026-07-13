<template>
	<component :is="props.as" class="text-text-soft text-base leading-relaxed font-normal">
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
