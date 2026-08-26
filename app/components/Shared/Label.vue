<template>
	<UBadge :label="label" color="neutral" variant="outline" :class="archived ? 'opacity-60' : ''" />
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		label: string
		archived?: boolean
	}>(),
	{
		archived: false,
	}
)
</script>