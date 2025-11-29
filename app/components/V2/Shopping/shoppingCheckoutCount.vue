<template>
	<div class="w-full flex flex-col font-[Montserrat] bg-white rounded-2xl shadow-md p-4">
		<!-- header + checkbox -->
		<div class="flex items-center justify-between mb-4" :style="{ gap: headerGap + 'px' }">
			<div class="font-semibold text-[16px] text-black flex-1">Mark Expired Items</div>

			<!-- checkbox -->
			<div class="flex items-center">
				<div @click="toggleChecked" class="w-5 h-5 bg-[#154734] rounded-sm shadow-sm flex items-center justify-center cursor-pointer transition">
					<svg v-if="checked" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
					</svg>
				</div>
			</div>
		</div>

		<!-- quantity section -->
		<div class="flex flex-col" :style="{ gap: rowGap + 'px' }">
			<!-- total quantity -->
			<div class="flex items-center">
				<span class="font-medium text-[15px] text-black" :style="{ width: labelWidth + '75px', marginRight: labelGap + 'px' }"> Total QTY </span>
				<input
					:value="totalQty"
					type="number"
					min="0"
					class="w-[60px] h-[30px] text-center font-medium text-black border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-[#154734]"
					readonly
				/>
			</div>

			<!-- adjusted quantity -->
			<div class="flex items-center">
				<span class="font-medium text-[15px] text-black" :style="{ width: labelWidth + '75px', marginRight: labelGap + 'px' }"> Adjusted QTY </span>
				<input
					:value="adjustedQty"
					type="number"
					min="0"
					class="w-[60px] h-[30px] text-center font-medium text-black border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-[#154734]"
					readonly
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	totalQty: { type: Number, default: 0 },
	adjustedQty: { type: Number, default: 0 },
	checked: { type: Boolean, default: false },
	headerGap: { type: Number, default: 12 },
	rowGap: { type: Number, default: 12 },
	labelWidth: { type: Number, default: 100 },
	labelGap: { type: Number, default: 8 },
})

const emit = defineEmits(["update:checked"])

const toggleChecked = () => {
	emit("update:checked", !props.checked)
}
</script>
