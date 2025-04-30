<template lang="pug">
div.flex.flex-row.items-center.justify-between.border-b.border-black.w-full
	//- Leftmost is ID
	div(class="w-[80px]").flex.justify-start.pl-2.mr-20
		| {{ position }} {{ identification }}
	//- Next to that is the timer, will be empty for now
	div.flex.items-center.justify-center
		| 00:00:00
		//- **************WILL CONTAIN THE TIMER FUNCTION***************
	//- At the end is the confirm and remove buttons
	div.flex.justify-end
		button.flex.items-center.justify-center.m-2.bg-green-500.bg-green-700.text-white.font-bold.py-2.px-4.rounded-md.modal-button
			| Confirm
		button.flex.items-center.justify-center.m-2.bg-red-500.bg-red-700.text-white.font-bold.py-2.px-4.rounded-md.modal-button
			| Remove
</template>
<script lang="ts" setup>
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
</script>
