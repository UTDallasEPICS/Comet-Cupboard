<template>
	<UButton variant="ghost" :to="to">
		<div class="flex items-center justify-center gap-x-2">
			<UIcon :name="icons['back']" />
			<SharedTextBase class="text-final-utd-orange">{{ text }}</SharedTextBase>
		</div>
	</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
	text: {
		type: String,
		required: true,
	},
	to: {
		type: String,
		required: true,
	},
})
</script>
