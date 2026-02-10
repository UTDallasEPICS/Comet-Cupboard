<template>
	<UCard>
		<template #header>
			<p>In Cupboard</p>
		</template>

		<p># of students: {{ numStudents }}</p>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
	numStudents: number
}>()
</script>
