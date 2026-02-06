<template>
	<div>
		<div class="absolute top-20 left-0 z-30 flex h-16 w-full justify-center">
			<V2SharedHeaderSubheader pageTitle="Deal" class="md:max-w-[600px] md:rounded-b-3xl"></V2SharedHeaderSubheader>
		</div>
		<div class="mt-20 flex flex-col items-center justify-center gap-y-8 pt-10">
			<div class="drop-shadow-standard relative flex h-80 w-full max-w-80 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-white">
				<!-- Deal Tag -->
				<div v-if="dealExists" class="bg-utd-orange absolute top-0 left-0 z-20 w-32 rounded-tl-md rounded-br-md px-4 py-1">
					<p class="text-center text-white">{{ dealText }}</p>
				</div>
				<img v-if="imageUrl" :src="imageUrl" class="absolute inset-0 h-full w-full object-cover" />
				<div class="flex flex-row items-center gap-x-3"></div>
			</div>
			<div class="flex flex-col items-center justify-center">
				<div class="flex flex-row items-center gap-3">
					<p class="">Deal is</p>
					<div class="flex flex-col items-center">
						<input
							:class="{ 'text-red-negative border-red-negative': invalidActualCount }"
							min="1"
							type="number"
							v-model.number="actualCount"
							@change="checkInput"
							:placeholder="originalActualCount"
							class="w-8 border-none bg-transparent text-center text-black outline-none"
						/>
						<div class="bg-cupboardv2-dg -mt-1 h-[3px] w-8 rounded-xl"></div>
					</div>
					<p class="">for</p>
					<div class="flex flex-col items-center">
						<input
							:class="{ 'text-red-negative border-red-negative': invalidAdjustedCount }"
							min="0"
							type="number"
							v-model.number="adjustedCount"
							@change="checkInput"
							:max="actualCount !== null ? actualCount - 1 : undefined"
							:placeholder="originalAdjustedCount"
							class="w-8 border-none bg-transparent text-center text-black outline-none"
						/>
						<div class="bg-cupboardv2-dg -mt-1 h-[3px] w-8 rounded-xl"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- Mark free and remove deals buttons -->
		<button @click="markAsFree" class="bg-utd-green drop-shadow-standard relative mt-6 flex h-12 w-48 items-center justify-center rounded-xl">
			<p class="text-white">Mark as Free</p>
		</button>
		<button
			v-if="dealExists"
			@click="deleteDeal"
			class="bg-red-negativev2 drop-shadow-standard relative mt-6 flex h-12 w-48 items-center justify-center rounded-xl"
		>
			<p class="text-white">Remove Deals</p>
		</button>
		<!-- Footer Buttons -->
		<div class="mt-20 flex flex-row gap-x-4">
			<button @click="goBack" class="bg-cupboardv2-dg drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
				<p class="text-white">Cancel</p>
			</button>
			<button @click="editDeal" class="bg-utd-orange drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
				<p class="text-white">Submit</p>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRoute, navigateTo } from "#imports"

const route = useRoute()
const itemID = route.params.itemID as string

// Fetch item data based on route
const { data: item } = await useFetch(`/api/inventory/item`, {
	params: { itemID },
})

const imageUrl = ref("")
const emit = defineEmits(["submit"])
const currentCategory = route.params.categoryName as string

const actualCount = ref<number | null>(null)
const adjustedCount = ref<number | null>(null)
const originalActualCount = ref<string>("X")
const originalAdjustedCount = ref<string>("Y")
const invalidActualCount = ref(false)
const invalidAdjustedCount = ref(false)

watch(
	item,
	(val) => {
		if (!val) return

		if (val.Deal) {
			const a = Number(val.Deal.actualCount)
			const b = Number(val.Deal.adjustedCount)

			actualCount.value = !isNaN(a) ? a : null

			adjustedCount.value = !isNaN(b) ? b : null
		} else {
			actualCount.value = null
			adjustedCount.value = null
		}

		originalActualCount.value = actualCount.value !== null ? String(actualCount.value) : "X"
		originalAdjustedCount.value = adjustedCount.value !== null ? String(adjustedCount.value) : "Y"

		imageUrl.value = val.imgName ? `/api/image/${item.value.imgName}` : ""
	},
	{ immediate: true }
)

const toggleDeal = () => {
	emit("submit")
}

const deleteDeal = async () => {
	if (!item.value) return
	await $fetch("/api/inventory/deal", {
		method: "DELETE",
		body: { itemID: item.value.itemID },
	})
	toggleDeal()
	navigateTo(`/inventory/${currentCategory}`)
}

const markAsFree = () => {
	if (!item.value) return
	actualCount.value = 1
	adjustedCount.value = 0
}

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/inventory/${currentCategory}`)
}

const checkInput = () => {
	const a = actualCount.value
	const b = adjustedCount.value

	invalidActualCount.value = false
	invalidAdjustedCount.value = false

	let alertText = ""

	if (a === null || a === undefined || Number.isNaN(a)) {
		invalidActualCount.value = true
		alertText = "The actual count must be a number"
	} else if (a < 1) {
		invalidActualCount.value = true
		alertText = "The actual count must greater than zero"
	}
	if (b === null || b === undefined || Number.isNaN(b)) {
		invalidAdjustedCount.value = true
		if (alertText === "") {
			alertText += "The adjusted count must be a number"
		} else {
			alertText += ", the adjusted count must be a number"
		}
	} else if (b < 0) {
		invalidAdjustedCount.value = true
		if (alertText === "") {
			alertText += "The adjusted count must be positive"
		} else {
			alertText += ", the adjusted count must be positive"
		}
	}
	if (!Number.isNaN(a) && !Number.isNaN(b) && a !== null && b !== null && a <= b) {
		invalidActualCount.value = true
		invalidAdjustedCount.value = true
		alertText = "The actual count must be greater than the adjusted count"
	}
	alertText += "."
	return alertText
}

const dealExists = computed(() => {
	return item.value?.Deal != null
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	const a = item.value.Deal.actualCount
	const b = item.value.Deal.adjustedCount

	if (a === 1 && b === 0) return "FREE"

	return `${a} for ${b}`
})

const editDeal = async () => {
	if (!item.value) return
	const alertText = checkInput()

	if (invalidActualCount.value || invalidAdjustedCount.value) {
		alert(alertText)
		return
	}

	await $fetch("/api/inventory/deal", {
		method: "PUT",
		body: { itemID: item.value.itemID, actualCount: actualCount.value, adjustedCount: adjustedCount.value },
	})
	toggleDeal()
	navigateTo(`/inventory/${currentCategory}`)
}
</script>
