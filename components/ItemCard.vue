<template lang="pug">
div.w-72.relative
	// Deal 
	div(v-if="dealExists").absolute.bg-utd-orange.rounded-tl-md.w-32.px-4.py-1.rounded-br-md
		p.text-white.text-center.font-semibold {{ dealText }}

	// Image 
	img(:alt="name" :src="`api/image/${imgName}`").w-72.h-72.drop-shadow-standard.object-cover.rounded-md

	// Inventory Display 
	div(v-if="typeOfCard === 'INVENTORY'")
		Menu
			MenuButton.absolute.top-2.right-2.bg-gray-300.bg-opacity-90.cursor-pointer.w-12.h-12.content-center.rounded-full.hover_drop-shadow-standard
				div.flex.flex-row.space-x-1.justify-center
					div.w-2.h-2.bg-white.border-2.border-black.rounded-full
					div.w-2.h-2.bg-white.border-2.border-black.rounded-full
					div.w-2.h-2.bg-white.border-2.border-black.rounded-full

			TransitionsPopUp
				MenuItems.absolute.top-16.right-2.bg-white.bg-opacity-90.drop-shadow-standard.rounded-md.py-2.px-6
					MenuItem
						div(@click="editItem").flex.justify-center.items-center.px-1.py-1.cursor-pointer.border-b.border-gray-400.text-lg.font-normal.hover_underline Edit
					MenuItem(v-if="permissions['ADMIN']")
						div(@click="removeItem").flex.justify-center.items-center.px-1.py-1.cursor-pointer.border-b.border-gray-400.text-lg.font-normal.hover_underline Remove
					MenuItem
						div(@click="editDeal").flex.justify-center.items-center.px-1.py-1.cursor-pointer.text-lg.font-normal.hover_underline Item Deal

		div.flex.justify-center.items-center.mt-2.rounded-full
			div(class="w-1/2").border.border-utd-orange.rounded-l-full.py-1.flex-grow.flex.items-center.justify-center
				span.text-sm.font-semibold.text-black {{ currentCount }}
			div(class="w-1/2").border.border-utd-orange.bg-utd-orange.border-l-0.bg-opacity-20.rounded-r-full.py-1.flex-grow.flex.items-center.justify-center
				span.text-sm.font-semibold.text-utd-orange {{ changeCountString }}

		div.flex.justify-center.items-center.space-x-6.mt-4
			button(
				@click="$emit('changeAmountUpdate', itemID, -changeInput)"
			).bg-utd-green.text-white.rounded-full.w-12.h-12.flex.place-content-center.place-items-center.soft-button
				MinusIcon.fill-white.stroke-white.h-6

			input(min="1" step="1" type="number" v-model="changeInput").input.no-spinner.border-b-2.w-10.text-center

			button(
				@click="$emit('changeAmountUpdate', itemID, changeInput)"
			).bg-utd-green.text-white.rounded-full.w-12.h-12.flex.place-content-center.place-items-center.soft-button
				PlusIcon.fill-white.stroke-white.h-6

	// Shopping Display 
	div(v-if="typeOfCard === 'SHOPPING'").mt-4.text-lg
		button(@click="addToCart").bg-utd-green.text-white.py-1.rounded-full.w-full.font-semibold.soft-button Add to Cart

	// Name 
	div.mt-3.text-center
		p.text-xl {{ name }}
</template>

<script lang="ts" setup>
import { PlusIcon, MinusIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"

const { getCart } = useCartStore()

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgName: {
		type: String,
		required: true,
	},
	itemID: {
		type: String,
		required: true,
	},
	currentCount: {
		type: Number,
		required: false,
		default: 0,
	},
	changeCount: {
		type: Number,
		required: false,
		default: 0,
	},
	itemDeal: {
		type: Object,
		required: false,
		default: () => {
			return {}
		},
	},
	typeOfCard: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["editItem", "deleteItem", "editDeal"])

const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})
const isDropdownOpen = ref(false)
const changeInput = ref(1)

const dealExists = computed(() => {
	return Object.keys(props.itemDeal).includes("actualCount") && Object.keys(props.itemDeal).includes("adjustedCount")
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	if (props.itemDeal.actualCount == 1 && props.itemDeal.adjustedCount == 0) {
		return "FREE"
	}
	return `DEAL: ${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`
})

const changeCountString = computed(() => {
	if (props.changeCount >= 0) {
		return `+${props.changeCount}`
	} else {
		return `${props.changeCount}`
	}
})

const editItem = () => {
	emit("editItem", { name: props.name, imgName: props.imgName, itemID: props.itemID })
}

const removeItem = () => {
	emit("deleteItem", { name: props.name, imgName: props.imgName, itemID: props.itemID })
}

const editDeal = () => {
	emit("editDeal", { name: props.name, actualCount: props.itemDeal.actualCount, adjustedCount: props.itemDeal.adjustedCount, itemID: props.itemID })
}

const addToCart = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	await getCart()
}
</script>
