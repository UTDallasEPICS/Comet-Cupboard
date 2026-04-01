<template>
	<UCard
		class="border-final-border-soft relative shadow-md"
		:ui="{
			body: 'p-2 py-2 sm:p-2 sm:py-2',
		}"
	>
		<div class="flex flex-col items-center">
			<img
				:src="`/api/public/image/${imgName}`"
				:alt="name"
				class="border-final-border-soft aspect-square h-full w-16 rounded-lg border object-cover"
			/>
			<SharedCardTitle>{{ name }}</SharedCardTitle>
            <SharedCardTitle>Qty: {{ qty }}</SharedCardTitle>
		</div>
		
	</UCard>
</template>

<script setup>

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgName: {
		type: String,
		required: true,
	},
	qty: {
		type: Number,
		required: true,
	},

})

</script>
