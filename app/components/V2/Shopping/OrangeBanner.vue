<template>
	<!-- orange banner -->
	<div
		class=" flex w-full items-center justify-center text-center text-white"
		:style="{ height: height + 'px', fontSize: '25px', lineHeight: '30px', backgroundColor: '#E4701E' }"
	>
		{{ title }}
	</div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: "Cart Processing" },
  height: { type: Number, default: 37 } // Banner height
})
</script>
