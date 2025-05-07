<template lang="pug">
div.flex.flex-row.items-center.justify-between.border-b.border-black.w-full
	//- Leftmost is ID
	div(class="w-[80px]").flex.flex-row.justify-start.pl-2.sm_mr-10.md_mr-20.gap-2
		div.w-2
			| {{ position }}
		div
			| {{ identification }}
	//- Next to that is the timer, will be empty for now
	div.flex.items-center.justify-center
		| 00:00:00
		//- **************WILL CONTAIN THE TIMER FUNCTION***************
	//- At the end is the confirm and remove buttons
	div.flex.flex-row.justify-end
		button(@click="intoCupboard").flex.items-center.justify-center.m-2.remove-button-effects
			CheckCircleIcon.h-10.w-10.text-green-500.hover_drop-shadow-lg
		button(@click="removeFromQueue").flex.items-center.justify-center.m-2.remove-button-effects
			XCircleIcon.h-10.w-10.text-red-500.hover_drop-shadow-lg
</template>
<script lang="ts" setup>
import { CheckCircleIcon } from "@heroicons/vue/24/solid"
import { XCircleIcon } from "@heroicons/vue/16/solid"

const props = defineProps({
	identification: {
		type: String,
		required: true,
	},
	position: {
		type: Number,
		required: true,
	},
})
const emit = defineEmits(["refresh"])
// Visually removes the item from the queue, needs to update student's permission to removed so they have no access to site until they log in again
const removeFromQueue = async () => {
	try {
		await $fetch("/api/queue", {
			method: "DELETE",
			body: {
				netID: props.identification,
			},
		})
		console.log("Successfully deleted from queue")
		emit("refresh")
	} catch (err) {
		console.error("Error deleting from cupboard:", err)
	}
}

// Visually adds the student into the cupboard. Updates permission of student to allow them access shopping cart
const intoCupboard = async () => {
	try {
		await $fetch("/api/queue", {
			method: "PUT",
			body: {
				netID: props.identification,
			},
		})
		console.log("Successfully added to cupboard")
		emit("refresh")
	} catch (err) {
		console.error("Error adding to cupboard:", err)
	}
}
</script>
