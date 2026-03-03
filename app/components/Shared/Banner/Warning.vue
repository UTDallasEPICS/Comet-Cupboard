<template>
	<UCard
		variant="outline"
		:ui="{
			body: 'bg-final-yellow-warning',
		}"
	>
		<div class="flex items-center gap-x-2">
			<UIcon :name="icons['warning']" />
			<SharedTextBase>{{ text }}</SharedTextBase>
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
