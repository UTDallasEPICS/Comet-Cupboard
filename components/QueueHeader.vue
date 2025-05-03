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
			CheckCircleIcon(class="h-10 w-10 text-green-500")
		button(@click="removeFromQueue").flex.items-center.justify-center.m-2.remove-button-effects
			XCircleIcon(class="h-10 w-10 text-red-500")
		
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
const emit = defineEmits(["removeFromQueue", "addToCupboard"])
// Visually removes the item from the queue, needs to update student's permission to removed so they have no access to site until they log in again
const removeFromQueue = () => {
	emit("removeFromQueue", props.identification)
}

// Visually adds the student into the cupboard. Updates permission of student to allow them access shopping cart
const intoCupboard = () => {
	emit("addToCupboard", props.identification)
}
</script>
