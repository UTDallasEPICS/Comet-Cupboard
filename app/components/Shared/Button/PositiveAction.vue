<template>
	<UButton
		variant="solid"
		:ui="{
			base: 'bg-utd-green rounded-3xl justify-center items-center',
		}"
	>
		{{ props.text }}
	</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
	text: {
		type: String,
		required: true,
	},
})
</script>
