<template>
	<UButton variant="ghost">
		<div class="flex items-center gap-x-2">
			<UIcon :name="icons['back']" />
			<p>{{ text }}</p>
		</div>
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
