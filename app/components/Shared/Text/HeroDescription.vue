<template>
	<component :is="props.as" class="text-text-soft text-lg md:text-xl">
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
