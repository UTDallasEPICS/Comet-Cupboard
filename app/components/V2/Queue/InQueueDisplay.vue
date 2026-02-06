<template>
	<div class="flex w-full min-w-72 flex-col overflow-auto rounded-xl bg-white px-4 pb-4">
		<!-- Displays the heading for the queue display: -->
		<div class="flex h-10 w-full items-center justify-center">
			<p>In Queue</p>
		</div>
		<!-- No matter what if the queue is empty, display a message that it is empty -->
		<div v-if="queue.length == 0" class="flex h-72 w-full items-center justify-center rounded-xl p-4 text-center">
			<p>No students waiting in the queue at this time</p>
		</div>
		<!-- For volunteers, display the first 5 people in the queue with control elements -->
		<div v-else-if="permissions['VERIFY_CART']" class="mx-auto flex h-72 w-full flex-col gap-y-4 overflow-auto rounded-xl p-4">
			<div v-for="(queueItem, index) in queue.slice(0, 5)" :key="index">
				<V2QueueCard :identification="queueItem" :position="index + 1" />
			</div>
		</div>
		<!-- For students, displays the number of students in the queue: -->
		<div v-else class="flex h-9 w-full items-center justify-center rounded-xl p-4">
			<p># of students: {{ queue.length }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	queue: string[]//List of students in the queue
}>()

//User permissions:
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty
</script>
