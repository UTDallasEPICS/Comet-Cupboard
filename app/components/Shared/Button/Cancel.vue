<template>
	<UButton
		variant="solid"
		:ui="{
			base: 'bg-final-cancel-gray',
		}"
	>
		{{ props.text }}
	</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
	text: {
		type: String,
		default: "Cancel",
	},
})
</script>
