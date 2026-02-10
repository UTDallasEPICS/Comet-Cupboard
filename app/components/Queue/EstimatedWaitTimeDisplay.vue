<template>
	<UCard>
		<template #header>
			<p>Estimated Wait Time:</p>
		</template>

		<div>
			<p>{{ time }}</p>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
	time: string
}>()
</script>
