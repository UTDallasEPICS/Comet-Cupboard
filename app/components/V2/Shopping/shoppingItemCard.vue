<template>
	<div class="relative w-[279px] h-[88px] bg-white rounded-[15px] shadow px-3 font-montserrat">
		<!-- BADGE (free / deal) -->
		<ItemBadge v-if="badge" :badge="badge" :quantity="quantity" :countsAs="countsAs" />

		<!-- photo icon  -->
		<PhotoIcon class="absolute left-[13px] top-[14px] w-[60px] h-[60px] text-gray-400 border border-gray-300 rounded p-2" />

		<!-- product name -->
		<div class="absolute left-[100px] top-0 right-[90px] h-full flex items-center text-black text-[15px] leading-[17px] font-medium break-words text-left">
			{{ name }}
		</div>

		<!-- add button -->
		<button
			class="absolute right-1 bottom-1 w-[70px] h-7 bg-[#154734] text-white text-[18px] font-medium rounded-[10px] hover:bg-green-900"
			@click="$emit('add-to-cart', { name, badge, quantity, countsAs })"
		>
			+ Add
		</button>
	</div>
</template>

<script setup>
import { PhotoIcon } from "@heroicons/vue/24/outline"
import ItemBadge from "./shoppingDealBadge.vue" // Badge component

defineProps({
	name: String,
	badge: { type: String, default: null }, // "free", "deal", or null
	quantity: { type: Number, default: 3 }, // for deal badge
	countsAs: { type: Number, default: 1 }, // for deal badge
})
</script>

<style scoped></style>
