<template lang="pug">
//- Card representing the student in the queue
div(class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
    
    //- Displays the student's net ID at the left of the card
    div(class="w-5/12").flex.items-center.font-bold.font-montserrat.h-full.pl-2.text-xs.lg_text-3xl
        p {{ position }}. {{ identification }}
    
    //- Displays the timer at the center of the card - the timer is empty for now.
    div.flex.font-montserrat.items-center.text-xs.lg_text-3xl.mr-auto.pr-1
        p 00:00:00
        //- **************WILL CONTAIN THE TIMER FUNCTION***************
    
    //- Displays the confirm and remove buttons at the right of the card
    div(class="gap-1").flex.flex-row.items-center.ml-auto.mr-2
        
        //- Confirm button: if pressed, then the student is moved to the cupboard.
        button(class="size-1/2" @click="intoCupboard").remove-button-effects.aspect-square
            CheckIcon
        
        //- Remove button: if pressed, then the student is removed from the queue and denied access.
        button(class="size-1/2" @click="removeFromQueue").remove-button-effects.aspect-square
            XMarkIcon
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
