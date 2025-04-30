<template lang="pug">
div.w-full.flex.flex-col.border-2.border-black.rounded-md
	div.text-2xl.font-bold.text-center.border-b-2.border-black
		| In Queue
	//- No matter what if the queue is empty, display a message that it is empty
	div(v-if="queue.length == 0").flex.flex-col.items-center.justify-center.h-72
		| Queue is empty
	//- For volenteers, display the first 5 people in the queue with control elements
	div(v-else-if="permissions['VERIFY_CART']" as="div").flex.flex-col.justify-start.items-start
		div.w-full
			div(v-for="(queueItem, index) in queue.slice(0, 5)" :key="index")
				QueueHeader(@add-to-cupboard="toCupboard" @removeFromQueue="removeFromQueue" :identification="queueItem" :position="index + 1")
		//-Display the rest as text
		div(v-for="(queueItem, index) in queue.slice(5)" :key="index").w-full.mb-1
			div.flex.flex-row.justify-start.pl-2.gap-2
				div.w-4
					| {{ index + 6 }}
				div
					| {{ queueItem }}

	//- All other users see everyone in the queue with no control elements
	div(v-else as="div").flex.flex-col.justify-start.items-start
		div(v-for="(queueItem, index) in queue" :key="index").w-full.mb-1
			div.flex.flex-row.justify-start.pl-2.gap-2
				div.w-4
					| {{ index + 1 }}
				div
					| {{ queueItem }}
</template>

<script lang="ts" setup>
import { IdentificationIcon } from "@heroicons/vue/20/solid"

const emit = defineEmits(["addToCupboard"])

const queue = ref([
	"Mary",
	"John",
	"Holly",
	"Noelle",
	"Man",
	"Steve",
	"Alice",
	"Bob",
	"Charlie",
	"Diana",
	"Eve",
	"Frank",
	"Grace",
	"Hank",
	"Ivy",
	"Jack",
] as string[])
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty

const toCupboard = (Identification: string) => {
	// Add the item to the cupboard
	queue.value = queue.value.filter((item) => item !== Identification)
	emit("addToCupboard", Identification) // Emit the event to add to cupboard
	// Update the cookie of the student to allow them access to site until they log in again
}

const removeFromQueue = (identification: string) => {
	// Remove the item from the queue
	queue.value = queue.value.filter((item) => item !== identification)
	// Update the cookie of the student to removed so they have no access to site until they log in again
}
</script>
