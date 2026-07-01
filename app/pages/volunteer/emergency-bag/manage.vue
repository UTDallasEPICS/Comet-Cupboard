<template>
	<div>
		<div class="mx-4">
			<UButton label="← Back to Dashboard" class="bg-white text-orange-400" />
			<h1 class="text-2xl font-bold">Manage Emergency Bags</h1>
		</div>
		<div class="mt-4 flex w-full items-center justify-center">
			<!--Tabs-->
			<UContainer>
				<div class="w-full">
					<UStepper ref="stepper" :items="steps">
						<template #content="{ item }">
							<div v-if="item.label === 'Add'">
								<div class="flex justify-center">
									<div class="flex w-full max-w-100 flex-col gap-4">
										<!-- Current Bag Items -->
										<div class="flex items-center justify-between">
											<h2 class="text-xl font-bold">Current Bag</h2>
											<UPopover>
												<UButton class="bg-final-utd-green rounded-lg px-4 py-2"> Add Items</UButton>

												<template #content>
													<div class="rounded-lg bg-gray-100 px-4 py-3">
														<UInput
															v-model="searchQuery"
															icon="i-lucide-search"
															placeholder="Search items"
															variant="outline"
															class="w-full"
														/>
													</div>
													<div class="h-fit max-h-124 space-y-3 overflow-y-auto px-3 py-3">
														<div v-if="!filteredItems?.length" class="py-8 text-center text-gray-500">
															Search results will appear here
														</div>
														<div
															v-for="item in filteredItems || []"
															:key="item.itemID"
															class="flex flex-row items-center justify-between gap-3 rounded bg-gray-100 p-3"
														>
															<!-- Image -->
															<img
																v-if="item.imgName && item.categoryName"
																:src="`/api/public/image/${item.imgName}`"
																:alt="item.name"
																class="h-10 w-10 rounded object-cover sm:h-12 sm:w-12"
															/>
															<div v-else class="flex h-12 w-12 items-center justify-center rounded bg-gray-300">
																<span class="text-xs text-gray-500">No Img</span>
															</div>

															<!-- Item Info -->
															<div class="flex-1">
																<p class="font-semibold">{{ item.name }}</p>
																<p class="text-sm text-gray-600">
																	Available: {{ getAvailableQuantity(item.itemID) }} / {{ item.quantity }}
																</p>
															</div>

															<!-- Add Button -->
															<UButton
																size="sm"
																:disabled="getAvailableQuantity(item.itemID) <= 0"
																class="bg-final-utd-green px-3 py-1 text-sm text-white"
																@click="addItemToBag(item)"
															>
																+ Add
															</UButton>
														</div>
													</div>
												</template>
											</UPopover>
										</div>

										<!-- Search Bar -->

										<div class="h-130 space-y-2 overflow-y-auto">
											<div v-if="bagItems.length === 0" class="text-center text-gray-500">No items in bag yet</div>
											<div v-for="item in bagItems" :key="item.itemID">
												<UCard>
													<template #header>
														<div class="flex items-center justify-between">
															<p class="text-sm font-semibold">{{ item.name }}</p>
															<UButton
																class="rounded bg-orange-600 px-2 py-1 hover:bg-gray-500"
																@click="removeItemFromBag(item.itemID)"
																>✕</UButton
															>
														</div>
													</template>
													<div class="flex items-center justify-between">
														<img
															v-if="item.imgName"
															:src="`/api/public/image/${item.imgName}`"
															:alt="item.name"
															class="h-10 w-10 rounded object-cover sm:h-12 sm:w-12"
														/>
														<div class="flex items-center gap-2">
															<UButton
																class="bg-final-utd-green rounded-2xl px-2 py-1 hover:bg-green-700"
																@click="decreaseItemCount(item.itemID)"
																>−</UButton
															>
															<span class="w-6 text-center font-semibold">{{ item.count }}</span>
															<UButton
																class="bg-final-utd-green rounded-2xl px-2 py-1 hover:bg-green-700"
																@click="increaseItemCount(item.itemID)"
																>+</UButton
															>
														</div>
													</div>
												</UCard>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-if="item.label === 'Details'">
								<div class="flex flex-col items-center">
									<div class="flex w-full max-w-100 flex-col gap-4">
										<!--Category Selection -->
										<UCard>
											<template #header>
												<div class="text-xl font-bold text-gray-700">Label Tag</div>
											</template>
											<UCheckboxGroup v-model="selectedCategory" size="md" variant="card" :items="labels" />
										</UCard>

										<div class="flex h-full flex-col">
											<!--Expiry Date -->
											<UCard class="h-50 flex-1">
												<template #header>
													<div class="flex-1 text-xl font-bold text-gray-700">Expiry Date</div>
												</template>
												<div class="flex h-full items-center justify-center">
													<UInputDate v-model="expiryDate" size="xl" icon="i-lucide-calendar" :min-value="minDate" />
												</div>
											</UCard>
										</div>

										<UCard>
											<!-- Privacy -->
											<template #header>
												<div class="text-xl font-bold text-gray-700">Privacy</div>
											</template>
											<URadioGroup v-model="selectedPrivacy" size="md" variant="card" :items="privacy" />
											<UTextarea
												v-if="selectedPrivacy === 'PRIVATE'"
												v-model="bagDescription"
												placeholder="Optional bag description"
												class="mt-2 w-full"
												:rows="4"
											/>
										</UCard>
									</div>
								</div>
							</div>
							<div v-if="item.label === 'Confirm'">
								<div class="flex flex-col items-center">
									<div class="flex w-full max-w-100 flex-col gap-4">
										<div class="flex h-full flex-col">
											<!-- Bag Details -->
											<UCard class="h-50 flex-1">
												<template #header>
													<div class="flex-1 text-xl font-bold text-gray-700">Bag Details</div>
												</template>
												<div class="space-y-1">
													<div class="flex">
														<p class="font-bold">Label:</p>
														<span
															v-for="label in labels.filter((l) => selectedCategory.includes(l.value))"
															:key="label.value"
															:class="`-py-1 rounded-full px-4 text-sm ${label.color}`"
														>
															{{ label.label }}
														</span>
													</div>
													<div class="flex gap-2">
														<p class="font-bold">Expiration:</p>
														<span>{{
															expiryDate ? `${expiryDate.month}/${expiryDate.day}/${expiryDate.year}` : "Date not set"
														}}</span>
													</div>
													<div class="flex gap-2">
														<p class="font-bold">Privacy:</p>
														<span>{{ selectedPrivacy }}</span>
													</div>
													<span v-if="selectedPrivacy === 'PRIVATE'">Description:</span>
												</div>
											</UCard>
										</div>
										<!--Category Selection -->
										<UCard>
											<template #header>
												<div class="text-xl font-bold text-gray-700">Items</div>
											</template>
											<div v-for="bagItem in bagItems" :key="bagItem.itemID" class="mb-2">
												<UCard>
													<template #header>
														<p>{{ bagItem.name }}</p>
													</template>
													<div class="flex items-center justify-between">
														<img
															:src="`/api/public/image/${bagItem.imgName}`"
															:alt="bagItem.name"
															class="h-10 w-10 rounded object-cover sm:h-12 sm:w-12"
														/>
														<p>x{{ bagItem.count }}</p>
													</div>
												</UCard>
											</div>
										</UCard>
									</div>
								</div>
							</div>
						</template>
					</UStepper>

					<div class="my-4 flex justify-between">
						<UButton leading-icon="i-lucide-arrow-left" class="bg-final-utd-orange" :disabled="!stepper?.hasPrev" @click="stepper?.prev()">
							Back
						</UButton>

						<UButton
							:trailing-icon="stepper?.hasNext ? 'i-lucide-arrow-right' : ''"
							:class="stepper?.hasNext ? 'bg-final-utd-orange' : 'bg-final-utd-green'"
							@click="stepper?.hasNext ? stepper?.next() : navigateTo('/dashboard')"
						>
							{{ stepper?.hasNext ? "Next" : "Confirm Bag" }}
						</UButton>
					</div>
				</div>
			</UContainer>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { resolveComponent } from "vue"
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date"

const UButton = resolveComponent("UButton")
const stepper = ref()

const resolvedComponents = {
	UButton: resolveComponent("UButton"),
	UCheckbox: resolveComponent("UCheckbox"),
	UDropdownMenu: resolveComponent("UDropdownMenu"),
}

//Tabs Setup
const steps = [
	{ label: "Add", icon: "i-lucide-shopping-cart", description: "Add Item" },
	{ label: "Details", icon: "i-lucide-square-pen", description: "Bag Details" },
	{ label: "Confirm", icon: "i-lucide-circle-check-big", description: "Confirm Bag" },
]

//Search Query
const manage_searchQuery = ref("")

//Add Tab
const labels = [
	{ label: "Vegetarian", value: "VEGETARIAN", color: "#ADBC76" },
	{ label: "Peanut Butter", value: "PEANUT_BUTTER", color: "#F6D6A2" },
]
const privacy = [
	{ label: "Public", value: "PUBLIC" },
	{ label: "Private", value: "PRIVATE" },
]
const selectedCategory = ref<string[]>([])
const selectedPrivacy = ref<string | null>(null)
const bagDescription = ref<string | null>(null)

//Search
const searchQuery = ref("")
const { data: volunteerItems } = await useFetch("/api/student/inventory/items")

const filteredItems = computed(() => {
	if (!volunteerItems.value) return []
	if (!searchQuery.value) return volunteerItems.value

	const query = searchQuery.value.toLowerCase()
	return volunteerItems.value.filter((item) => item.name.toLowerCase().startsWith(query))
})

// Get available count for an item in inventory
const getAvailableQuantity = (itemID: string): number => {
	const item = volunteerItems.value?.find((i) => i.itemID === itemID)
	const bagItem = bagItems.value.find((bi) => bi.itemID === itemID)

	if (!item) return 0
	return item.quantity - (bagItem?.count || 0)
}

// Current bag items with counts
const bagItems = ref<Array<{ itemID: string; count: number; name: string; imgName: string }>>([])

// Add item to bag or increase count
const addItemToBag = (item: any) => {
	const existingItem = bagItems.value.find((bi) => bi.itemID === item.itemID)
	if (existingItem) {
		existingItem.count++
	} else {
		bagItems.value.push({
			itemID: item.itemID,
			count: 1,
			name: item.name,
			imgName: item.imgName,
		})
	}
}

// Remove item from bag
const removeItemFromBag = (itemID: string) => {
	bagItems.value = bagItems.value.filter((item) => item.itemID !== itemID)
}

// Decrease count or remove if count reaches 0
const decreaseItemCount = (itemID: string) => {
	const item = bagItems.value.find((bi) => bi.itemID === itemID)
	if (item) {
		if (item.count === 1) {
			removeItemFromBag(itemID)
		} else {
			item.count--
		}
	}
}

//Increase item count
const increaseItemCount = (itemID: string) => {
	const item = bagItems.value.find((bi) => bi.itemID === itemID)
	if (item) {
		item.count++
	}
}

// Expiry Date - Minimum 1 week after current date
const minDate = today(getLocalTimeZone()).add({ days: 7 })
const expiryDate = shallowRef(minDate)

//Submit bag
const submitBag = async () => {
	if (!selectedCategory.value) {
		alert("Please select a category")
		return
	}

	if (!expiryDate.value) {
		alert("Please select an expiry date")
		return
	}

	if (bagItems.value.length === 0) {
		alert("Please add items to the bag")
		return
	}

	//Convert CalendarDate -> ISO string (midnight UTC)
	const y = expiryDate.value.year
	const m = String(expiryDate.value.month).padStart(2, "0")
	const d = String(expiryDate.value.day).padStart(2, "0")
	const isoDate = new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString()

	try {
		const response = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
			method: "POST",
			body: {
				bagCategory: selectedCategory.value,
				expiryDate: isoDate,
				items: bagItems.value.map((item) => ({
					itemID: item.itemID,
					count: item.count,
				})),
			},
		})

		console.log("Bag created successfully!", response)

		// Reset form
		selectedCategory.value = []
		bagItems.value = []
		expiryDate.value = minDate
		searchQuery.value = ""

		// Refresh bags list
		await refreshEmergencyBags()

		volunteerItems.value = await $fetch("/api/student/inventory/items")

		alert("Bag created successfully!")
	} catch (err: any) {
		console.error("Failed to create bag:", err)
		alert(`Error: ${err.message || "Failed to create bag"}`)
	}
}

//View Tab
const { data: emergencyBags, refresh: refreshEmergencyBags } = await useFetch("/api/volunteer/emergency-bag/emergencyBags")
const expanded = ref({})
const selected = ref({})

const { data: _moveLocations } = await useFetch("/api/volunteer/location")
const moveLocations = computed(() => {
	return _moveLocations.value?.map((loc) => loc.name) ?? []
})
const moveLocation = ref("")

const columnsDef = [
	{
		header: ({ table }) =>
			h(resolvedComponents.UCheckbox, {
				modelValue: table ? (table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? "indeterminate" : false) : false,
				"onUpdate:modelValue": (val) => table?.toggleAllRowsSelected(val),
			}),
		type: "checkbox2",
	},
	{ header: "Bag ID", accessorKey: "label", type: "text", sortable: true },
	{ header: "Location", accessorKey: "locationName", type: "text" },
	{ header: "Label", accessorKey: "bagCategory", type: "text", cell: ({ row }) => categoryMap[row.original.bagCategory] ?? row.original.bagCategory },
	/*{
    type: 'edit',icon: icons['edit'],
    onClick: (row) => {  console.log('To implement...')},
    meta: {class: {th: 'w-12 hidden md:table-cell', td: 'w-12 hidden md:table-cell'}}
  },*/
	{ type: "expand", meta: { class: { th: "w-12", td: "w-12" } } },
]

const columns = buildNuxtUITable(columnsDef, resolvedComponents)

const categoryMap: Record<string, string> = {
	VEGETARIAN_AND_PEANUT_BUTTER: "Veg_PB",
	VEGETARIAN_AND_NON_PEANUT_BUTTER: "Veg_NoPB",
	NONVEGETARIAN_AND_PEANUT_BUTTER: "NonVeg_PB",
	NONVEGETARIAN_AND_NON_PEANUT_BUTTER: "NonVeg_NoPB",
}

const filtered_viewData = computed(() => {
	if (!emergencyBags.value) return []

	const view_query = manage_searchQuery.value.toLowerCase().trim()

	return emergencyBags.value.filter((bag) => {
		const categoryShort = categoryMap[bag.bagCategory] ?? bag.bagCategory

		if (!view_query) return true

		return (
			bag.label?.toLowerCase().includes(view_query) ||
			bag.locationName?.toLowerCase().includes(view_query) ||
			categoryShort.toLowerCase().includes(view_query)
		)
	})
})

const selectedBagIDs = computed(() => {
	return Object.keys(selected.value).filter((id) => selected.value[id])
})

const moveBags = async () => {
	try {
		await $fetch("/api/volunteer/emergency-bag/emergencyBagsMove", {
			method: "PATCH",
			body: {
				bagIDs: selectedBagIDs.value,
				location: moveLocation.value,
			},
		})

		await refreshEmergencyBags()
		selected.value = {}
	} catch (err) {
		console.error("Failed to move bags", err)
	}

	await refreshEmergencyBags()
	selected.value = {}
}

const moveSingleBag = async (bagID, location) => {
	try {
		await $fetch("/api/volunteer/emergency-bag/emergencyBagsMove", {
			method: "PATCH",
			body: {
				bagIDs: [bagID],
				location,
			},
		})
	} catch (err) {
		console.error(`Failed for ${bagID}`, err)
	}
	await refreshEmergencyBags()
}

const deleteBag = async (bagID, close) => {
	try {
		await $fetch("/api/volunteer/emergency-bag/emergencyBagArchive", {
			method: "POST",
			body: { bagID },
		})

		await refreshEmergencyBags()
		close()
	} catch (err) {
		console.error(err)
	}
	selected.value = {}
}
</script>
