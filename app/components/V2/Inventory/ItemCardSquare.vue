<template lang="pug">
Menu
	div.bg-white.h-64.rounded-xl.flex.flex-col.items-center.gap-2.justify-top.drop-shadow-standard.relative
		// Deal tag on bottom right of card
		div(v-if="dealExists").absolute.bottom-0.right-0.bg-utd-orange.text-white.text-sm.font-bold.px-5.rounded-br-md.rounded-tl-md {{ dealText }}

		// Settings/options button
		MenuButton.absolute.top-2.right-2.w-8.h-4.content-center.rounded-full
			div.flex.flex-row.space-x-1.justify-center
				div(class="w-1.5 h-1.5").bg-black.rounded-full
				div(class="w-1.5 h-1.5").bg-black.rounded-full
				div(class="w-1.5 h-1.5").bg-black.rounded-full

		// Wrap MenuItems in TransitionsPopUp, but forward slot content
		TransitionsPopUp
			MenuItems.absolute.top-5.right-2.bg-white.bg-opacity-90.drop-shadow-standard.rounded-md.py-2.px-6.z-50
				MenuItem
					div(@click="editItem").flex.justify-center.items-center.px-1.py-1.cursor-pointer.border-b.border-cupboardv2-lg.text-lg.font-normal.hover_underline Edit
				MenuItem
					div(@click="editDeal").flex.justify-center.items-center.px-1.py-1.cursor-pointer.border-b.border-cupboardv2-lg.text-lg.font-normal.hover_underline Item Deal
				MenuItem
					div(@click="deleteItem").flex.justify-center.items-center.px-1.py-1.cursor-pointer.text-lg.font-normal.hover_underline Delete
		// Image container
		div.relative.w-20.h-20.flex-shrink-0.overflow-hidden.mt-4
			img(:alt="itemName" :src="`/api/image/${imgName}`").w-full.h-full.object-cover

		// Text container (flex vertical)
		div.flex.flex-col.items-center.gap-4
			// Item name and in stock
			p.text-2xl.font-semibold {{ itemName }}
			div.flex.gap-3
				p.text-base Qty:
				div(class="border-[1px]").bg-white(class="w-[125px]").h-7.border-cupboardv2-dg.rounded-2xl.flex.justify-end.box-border.relative
					div.flex.items-center.justify-center
						span.text-base.text-black.mr-2 {{ props.currentCount }}
					div(:style="clipStyle").bg-cupboardv2-elg(
						class="w-[75px]"
					).rounded-r-2xl.flex.items-center.justify-center
						span.text-base.text-black {{ displayChange }}
			// Inventory adjustment buttons (flex horizontal)
			div.flex.gap-6
				button(@click="decrement").w-9.h-9.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
					MinusIcon(class="stroke-[3px]").w-7.h-7.text-white
				div.relative.flex.flex-col.items-center.mt-1
					input(
						placeholder="#"
						type="text"
						v-model="adjustAmount"
						@input="validateInput"
					).bg-transparent.w-12.-mb-1.outline-none.border-none.text-2xl.text-center.text-black
					div.bg-cupboardv2-dg.w-12.h-1.rounded-xl
				button(@click="increment").w-9.h-9.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
					PlusIcon(class="stroke-[3px]").w-7.h-7.text-white
</template>

<script lang="ts" setup>
import { MinusIcon, PlusIcon, PhotoIcon } from "@heroicons/vue/24/outline"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useRoute, navigateTo } from "#imports"

const props = defineProps({
	itemName: {
		type: String,
		default: "Item name",
	},
	imgName: {
		type: String,
		default: "",
	},
	currentCount: {
		type: Number,
		default: 0,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
	itemID: {
		type: String,
		required: true,
	},
})

const route = useRoute()
const categoryName = route.params.categoryName as string

const dealExists = computed(() => {
	return props.itemDeal.actualCount !== undefined && props.itemDeal.adjustedCount !== undefined
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	const a = props.itemDeal.actualCount
	const b = props.itemDeal.adjustedCount

	if (a === 1 && b === 0) return "FREE"

	return `${a} for ${b}`
})

const emit = defineEmits<{
	(e: "changeAmountUpdate", itemID: string, amountChange: number): void
}>()

// Per-click adjustment amount based on input
const adjustAmount = ref<string>("1")

// Functions for emits
function increment() {
	const step = parseInt(adjustAmount.value) || 0
	if (step <= 0) return
	emit("changeAmountUpdate", props.itemID, step)
}

function decrement() {
	const step = parseInt(adjustAmount.value) || 0
	if (step <= 0) return
	emit("changeAmountUpdate", props.itemID, -step)
}

function editItem() {
	navigateTo(`/v2/inventory/${categoryName}/${props.itemID}/edit`)
}

function deleteItem() {
	navigateTo(`/v2/inventory/${categoryName}/${props.itemID}/delete`)
}

function editDeal() {
	navigateTo(`/v2/inventory/${categoryName}/${props.itemID}/deal`)
}

const displayChange = computed(() => {
	const c = Number(props.changeCount || 0)
	return c > 0 ? `+${c}` : `${c}`
})

// Input validation so input is between 0-99 only
function validateInput(e: Event) {
	const input = (e.target as HTMLInputElement).value
	// Remove any non-digit characters from the input
	let digitsOnly = ""
	for (const char of input) {
		if (char >= "0" && char <= "9") {
			digitsOnly += char
		}
	}
	adjustAmount.value = digitsOnly === "" ? "" : Math.min(99, Number(digitsOnly)).toString()
}
// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = "clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)"
</script>
