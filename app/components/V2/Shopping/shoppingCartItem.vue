<template>
	<div class="relative w-[320px] h-[80px] bg-white font-montserrat overflow-hidden rounded-lg shadow">
		<!-- DELETE X as SVG -->
		<button @click="$emit('remove')" class="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-10 p-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				:class="['w-6 h-6 transition-colors', hoverX ? 'stroke-red-600' : 'stroke-black']"
				@mouseenter="hoverX = true"
				@mouseleave="hoverX = false"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</button>

		<!-- product picture -->
		<PhotoIcon class="absolute left-[33px] top-[10px] w-[60px] h-[60px] text-gray-400 border border-gray-300 rounded p-2" />

		<!-- editable product name -->
		<div class="absolute left-[100px] top-0 right-[70px] h-full flex items-center">
			<input
				v-model="editableName"
				@input="$emit('update:itemName', editableName)"
				placeholder="Item Name"
				class="bg-transparent border-none outline-none text-black text-[15px] font-medium w-full"
			/>
		</div>

		<!-- editable qty inputs -->
		<div
			class="absolute right-2 top-0 h-full w-[50px] flex flex-col gap-[4px] items-end"
			:class="showExpired ? 'justify-start pt-[16px]' : 'justify-center'"
		>
			<!-- total quantity -->
			<input
				v-model.number="editableQty"
				@input="updateQty"
				type="number"
				min="0"
				placeholder="1"
				class="w-full h-[30px] bg-gray-200/60 text-center text-[18px] font-medium text-black outline-none rounded"
			/>

			<!-- expiredquantity (only visible if checked is true) -->
			<div v-if="showExpired" class="flex items-center gap-2">
				<span class="text-red-600 text-[12px] leading-[14px] font-bold">Expired</span>
				<input
					v-model.number="editableQty2"
					@input="updateQty2"
					type="number"
					:max="editableQty"
					min="0"
					placeholder="0"
					class="w-[42px] h-[24px] bg-gray-200/60 text-center text-[16px] font-medium text-black outline-none rounded"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
	itemName: { type: String, default: "Sample Item" },
	qty: { type: Number, default: 1 },
	qty2: { type: Number, default: 0 },
	showExpired: { type: Boolean, default: false },
})

const emit = defineEmits(["remove", "update:itemName", "update:qty", "update:qty2"])

// local reactive copies
const editableName = ref(props.itemName)
const editableQty = ref(props.qty)
const editableQty2 = ref(props.qty2)
const hoverX = ref(false)

// wathc 4 prop changes
watch(
	() => props.itemName,
	(val) => (editableName.value = val)
)
watch(
	() => props.qty,
	(val) => (editableQty.value = val)
)
watch(
	() => props.qty2,
	(val) => (editableQty2.value = val)
)

// emit qty updates (make sure qty2 <= qty)
const updateQty = () => {
	if (editableQty2.value > editableQty.value) editableQty2.value = editableQty.value
	emit("update:qty", editableQty.value)
	emit("update:qty2", editableQty2.value)
}

const updateQty2 = () => {
	if (editableQty2.value > editableQty.value) editableQty2.value = editableQty.value
	emit("update:qty2", editableQty2.value)
}

import { PhotoIcon } from "@heroicons/vue/24/solid"
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap");
.font-montserrat {
	font-family: "Montserrat", sans-serif;
}

button {
	background: transparent;
	border: none;
	padding: 0;
}
</style>
