<template lang="pug">
div(class="w-[300px] h-[88px]").flex.bg-white.rounded-xl.px-2.py-2.relative.items-center
	// photo icon
	PhotoIcon(class="w-[60px] h-[60px]").text-gray-400.border.border-gray-300.rounded.p-2

	// product name
	div.h-full.flex.items-center.text-black.break-words.text-left.grow
		| {{ name }}

	div.flex.flex-col.h-full
		// BADGE (free / deal)
		ItemBadge(v-if="badge" :badge="badge" :countsAs="countsAs" :quantity="quantity").mb-auto.self-end
		// add button
		button(
			class="w-[70px] bg-[#154734] text-[18px] rounded-[10px] hover:bg-green-900"
			@click="$emit('add-to-cart', { name, badge, quantity, countsAs })"
		).h-7.text-white.mt-auto
			| + Add
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
