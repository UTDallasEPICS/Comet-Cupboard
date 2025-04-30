<template lang="pug">
div
	//- Left side is the people in the cupboard, right is the queue
	div.flex.flex-col.lg_flex-row.items-start.justify-center.gap-10.m-3
		div.flex.items-center.justify-center.flex-grow.w-full
			InCupboardQueue(:identification="toCupboard")
		div.flex.items-center.justify-center.flex-grow.w-full
			WaitingQueue(@addToCupboard="toCupboard = $event")
</template>
<script lang="ts" setup>
const toCupboard = ref("")
</script>
