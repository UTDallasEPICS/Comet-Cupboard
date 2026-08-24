<template>
	<ul :class="['grid gap-4', columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3']">
		<slot />
	</ul>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		columns?: 1 | 3
	}>(),
	{
		columns: 3,
	}
)
</script>
