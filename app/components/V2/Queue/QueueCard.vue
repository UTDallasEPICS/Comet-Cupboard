<template lang="pug">
//- Card representing the student in the queue
div.w-full.flex.flex-row.flex-wrap.gap-x-4.items-center.rounded-xl.drop-shadow-standard.bg-white.p-2
    
    //- Displays the student's net ID at the left of the card
    div.font-bold.h-full.text-nowrap.min-w-28
        p {{ position }}. {{ identification }}
    
    //- Displays the timer at the center of the card - the timer is empty for now.
    div.ml-auto
        p 00:00:00
        //- **************WILL CONTAIN THE TIMER FUNCTION***************
    
    //- Displays the confirm and remove buttons at the right of the card
    div.flex.flex-row.items-center.ml-auto.gap-1
        
        //- Remove button: if pressed, then the student is removed from the queue
        button(@click="removeFromQueue").remove-button-effects.aspect-square.w-8
            XMarkIcon

        //- Confirm button: if pressed, then the student is moved to the cupboard.
        button(@click="intoCupboard").remove-button-effects.aspect-square.w-8
            CheckIcon
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
