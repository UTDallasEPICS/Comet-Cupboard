<template>
	<!-- accepted message + countdown -->
	<div class="relative flex w-full items-center justify-center px-4" style="height: 97px; background-color: #8abf65">
		<p class="font-montserrat text-center font-medium text-black" style="font-size: 20px; line-height: 24px">
			Your cart has been accepted. Automatically signing out in {{ countdown }}...
		</p>
	</div>
</template>

<script setup lang="ts">
defineProps({
	countdown: {
		type: Number,
		required: true,
	},
})
</script>
