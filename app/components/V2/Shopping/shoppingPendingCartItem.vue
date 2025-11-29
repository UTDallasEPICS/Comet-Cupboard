<template>
	<div class="relative w-[293px] h-[80px] bg-white font-montserrat overflow-hidden flex">
		<!-- product picture -->
		<PhotoIcon class="absolute left-[13px] top-[14px] w-[60px] h-[60px] text-gray-400 border border-gray-300 rounded p-2" />

		<!-- product name block -->
		<div class="absolute left-[96px] top-[10px] right-[58px] h-[34px] flex items-center text-black text-[15px] leading-[17px] font-medium overflow-hidden">
			{{ name }}
		</div>

		<!-- qty numbers -->
		<div
			:class="[
				'absolute right-2 flex flex-col gap-[4px] items-center w-[46px]',
				isExpired ? 'top-[16px]' : 'top-[25px]', // moves down if not expired
			]"
		>
			<div class="relative w-full h-[30px] flex items-center justify-center text-[18px] leading-[22px] font-medium text-black">
				{{ qty }}
				<div class="absolute bottom-0 left-0 w-full h-px bg-black"></div>
			</div>
			<div class="relative w-full h-[24px] flex items-center justify-center text-[16px] leading-[19px] font-medium text-black">
				{{ qty2 }}
				<div class="absolute bottom-0 left-0 w-full h-px bg-black"></div>
			</div>
		</div>

		<!-- expired badge (if isExpired = true) -->
		<span v-if="isExpired" class="absolute left-[171px] bottom-1 text-red-600 text-[14px] leading-[17px] font-bold flex items-center"> Expired </span>
	</div>
</template>

<script setup>
import { PhotoIcon } from "@heroicons/vue/24/solid"

defineProps({
	image: {
		type: String,
		default: "https://via.placeholder.com/60",
	},
	name: {
		type: String,
		default: "Pending Item Name",
	},
	qty: {
		type: Number,
		default: 1,
	},
	qty2: {
		type: Number,
		default: 1,
	},
	isExpired: {
		type: Boolean,
		default: false,
	},
})
</script>

<style scoped></style>
