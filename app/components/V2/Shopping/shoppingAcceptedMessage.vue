<template lang="pug">
div(class="h-[97px] bg-[#8ABF65]").relative.w-full.rounded-none.flex.items-center.justify-center.px-4
	p.text-black.text-center
		| Your cart has been accepted. Automatically signing out in {{ countdown }}...
</template>

<script setup>
const props = defineProps({
	countdown: {
		type: Number,
		required: true,
	},
})
</script>