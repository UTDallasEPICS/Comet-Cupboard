<template>
	<UBadge color="neutral" variant="outline" class="whitespace-nowrap" :class="archived ? 'opacity-60' : ''">
		<span v-if="color" class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: color }" />
		{{ label }}
	</UBadge>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		label: string
		color?: string
		archived?: boolean
	}>(),
	{
		color: undefined,
		archived: false,
	}
)
</script>
