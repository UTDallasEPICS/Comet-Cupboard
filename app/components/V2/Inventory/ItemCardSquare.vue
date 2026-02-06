<template>
	<Menu>
		<div class="drop-shadow-standard relative flex h-64 w-full max-w-sm flex-col items-center rounded-xl bg-white">
			<!-- Deal tag on bottom right of card -->
			<div v-if="dealExists" class="bg-utd-orange absolute right-0 bottom-0 rounded-tl-md rounded-br-md px-5 text-white">
				{{ dealText }}
			</div>

			<!-- Settings/options button -->
			<MenuButton class="absolute top-2 right-2 h-4 w-8 content-center rounded-full">
				<div class="flex flex-row justify-center space-x-1">
					<div class="h-1.5 w-1.5 rounded-full bg-black"></div>
					<div class="h-1.5 w-1.5 rounded-full bg-black"></div>
					<div class="h-1.5 w-1.5 rounded-full bg-black"></div>
				</div>
			</MenuButton>

			<!-- Wrap MenuItems in TransitionsPopUp, but forward slot content -->
			<TransitionsPopUp>
				<MenuItems class="bg-opacity-90 drop-shadow-standard absolute top-5 right-2 z-50 rounded-md bg-white px-6 py-2">
					<MenuItem>
						<div
							@click="editItem"
							class="hover:underline border-cupboardv2-lg flex cursor-pointer items-center justify-center border-b px-1 py-1"
						>
							Edit
						</div>
					</MenuItem>
					<MenuItem>
						<div
							@click="editDeal"
							class="hover:underline border-cupboardv2-lg flex cursor-pointer items-center justify-center border-b px-1 py-1"
						>
							Item Deal
						</div>
					</MenuItem>
					<MenuItem>
						<div @click="deleteItem" class="hover:underline flex cursor-pointer items-center justify-center px-1 py-1">
							Delete
						</div>
					</MenuItem>
				</MenuItems>
			</TransitionsPopUp>

			<!-- Image container -->
			<div class="relative mt-4 h-20 w-20 flex-shrink-0 overflow-hidden">
				<img :alt="itemName" :src="`/api/image/${imgName}`" class="h-full w-full object-cover" />
			</div>
			<!-- Text container (flex vertical) -->
			<div class="flex flex-col items-center gap-4">
				<!-- Item name and in stock -->
				<p class="">{{ itemName }}</p>
				<div class="flex gap-3">
					<p class="">Qty:</p>
					<div class="border-cupboardv2-dg relative box-border flex h-7 w-[125px] justify-end rounded-2xl border-[1px] bg-white">
						<div class="flex items-center justify-center">
							<span class="mr-2 text-black">{{ props.currentCount }}</span>
						</div>
						<div :style="clipStyle" class="bg-cupboardv2-elg flex w-[75px] items-center justify-center rounded-r-2xl">
							<span class="text-black">{{ displayChange }}</span>
						</div>
					</div>
				</div>
				<!-- Inventory adjustment buttons (flex horizontal) -->
				<div class="flex gap-6">
					<button @click="decrement" class="bg-cupboardv2-dg flex h-9 w-9 items-center justify-center rounded-full">
						<MinusIcon class="h-7 w-7 stroke-[3px] text-white" />
					</button>
					<div class="relative mt-1 flex flex-col items-center">
						<input
							placeholder="#"
							type="text"
							v-model="adjustAmount"
							@input="validateInput"
							class="-mb-1 w-12 border-none bg-transparent text-center text-black outline-none"
						/>
						<div class="bg-cupboardv2-dg h-1 w-12 rounded-xl"></div>
					</div>
					<button @click="increment" class="bg-cupboardv2-dg flex h-9 w-9 items-center justify-center rounded-full">
						<PlusIcon class="h-7 w-7 stroke-[3px] text-white" />
					</button>
				</div>
			</div>
		</div>
	</Menu>
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
	navigateTo(`/inventory/${categoryName}/${props.itemID}/edit`)
}

function deleteItem() {
	navigateTo(`/inventory/${categoryName}/${props.itemID}/delete`)
}

function editDeal() {
	navigateTo(`/inventory/${categoryName}/${props.itemID}/deal`)
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
