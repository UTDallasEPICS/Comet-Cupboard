<template>
	<div class="drop-shadow-standard flex w-full flex-row flex-wrap items-center gap-x-4 rounded-xl bg-white p-2">
		<!-- Displays the student's net ID at the left of the card -->
		<div class="h-full min-w-28 font-bold text-nowrap">
			<p>{{ position }}. {{ identification }}</p>
		</div>
		<!-- Displays the timer at the center of the card - the timer is empty for now. -->
		<div class="ml-auto">
			<p>00:00:00</p>
			<!-- **************WILL CONTAIN THE TIMER FUNCTION*************** -->
		</div>
		<!-- Displays the confirm and remove buttons at the right of the card -->
		<div class="ml-auto flex flex-row items-center gap-1">
			<!-- Remove button: if pressed, then the student is removed from the queue -->
			<button @click="removeFromQueue" class="remove-button-effects aspect-square w-8">
				<XMarkIcon />
			</button>
			<!-- Confirm button: if pressed, then the student is moved to the cupboard. -->
			<button @click="intoCupboard" class="remove-button-effects aspect-square w-8">
				<CheckIcon />
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	//Net ID of student in the queue
    identification: {
		type: String,
		required: true,
	},
	//Position of the student based on how long they're at the queue
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
