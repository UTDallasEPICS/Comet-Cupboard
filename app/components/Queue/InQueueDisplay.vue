<template>
	<UCard>
		<template #header>
			<p>In Queue</p>
		</template>

		<div v-if="queue.length === 0" class="flex items-center justify-center p-4 text-center">
			<p>No students waiting in the queue at this time</p>
		</div>
		<div v-else-if="permissions['VERIFY_CART']" class="flex flex-col gap-y-4">
			<QueueCard v-for="(queueItem, index) in queue" :key="queueItem" :identification="queueItem" :position="index + 1" />
		</div>
		<div v-else>
			<p># of students: {{ queue.length }}</p>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
	queue: string[]
}>()
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty
</script>
