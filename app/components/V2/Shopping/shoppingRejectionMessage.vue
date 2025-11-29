<template>
	<div class="relative w-full max-w-[320px] h-[119px] bg-[#FFD580] rounded flex flex-col p-4 shadow-md">
		<!-- Header -->
		<div class="flex justify-center mb-2">
			<span class="font-montserrat font-medium text-[20px] leading-[24px] text-black"> Reason for rejection </span>
		</div>

		<!-- Message Section -->
		<div class="flex flex-1 items-center px-2">
			<!-- Warning Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
				class="w-6 h-6 text-black mr-3 flex-shrink-0"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
				/>
			</svg>

			<!-- Dynamic Message -->
			<p class="text-black font-montserrat text-[16px] leading-[20px] text-left flex-1">
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script setup>
// Define prop so message text is editable/dynamic
defineProps({
	message: {
		type: String,
		default: "Sample message: The item was expired and cannot be added to the cart.",
	},
})
</script>

<style scoped></style>
