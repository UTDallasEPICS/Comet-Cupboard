<template>
	<UCard
		variant="outline"
		:ui="{
			body: 'bg-final-yellow-warning',
		}"
	>
		<div class="flex items-center gap-x-2">
			<UIcon name="material-symbols:warning-rounded" />
			<p>{{ text }}</p>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	text: {
		type: String,
		required: true,
	},
})
</script>
