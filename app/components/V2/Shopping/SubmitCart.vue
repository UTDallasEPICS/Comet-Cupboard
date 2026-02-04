<template>
	<div class="mt-4 mb-8 flex w-full justify-center" style="max-width: 320px">
		<!-- submit button -->
		<button class="flex w-full items-center justify-center" @click="$emit('click')" style="height: 45px; background-color: #154734; border-radius: 15px">
			<span class="font-montserrat font-bold text-white" style="font-size: 25px; line-height: 30px">Submit Cart</span>
		</button>
	</div>
</template>

<script setup lang="ts"></script>
