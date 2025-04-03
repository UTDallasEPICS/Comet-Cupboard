<template lang="pug">
div.flex.flex-col.pt-2.pb-5.px-5.overflow-y-auto.overscroll-contain
	p.text-2xl.font-bold.text-center.mb-5
		| Statement of Understanding
	p.text-xl.text-center
		| I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand that the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree nuts. I also understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions.
	p.text-2xl.font-bold.text-center.mb-5.pt-5
		| Non-Discrimination Clause
	p.text-xl.text-center
		| UTD Comet Cupboard does not and shall not discriminate on the basis of race, color, religion (creed), gender, gender expression, age, national origin (ancestry), disability, marital status, sexual orientation, or military status, in any of its activities or operations.
	div.flex.flex-row.justify-end.space-x-5.pt-7
		button(@click="emit('cancel')").modal-button.w-40.bg-red-negative.text-white
			| Disagree
		button(@click="emit('accept')").modal-button.w-40.bg-utd-green.text-white
			| Yes, I Agree
</template>

<script lang="ts" setup>
const emit = defineEmits(["cancel", "accept"])
</script>
