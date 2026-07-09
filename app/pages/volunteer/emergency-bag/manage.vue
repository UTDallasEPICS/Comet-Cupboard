<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
			<SharedTextPageTitle>Manage Emergency Bags</SharedTextPageTitle>
		</header>
		<div>
			<div class="mt-4 flex w-full items-center justify-center">
				<UContainer>
					<div class="w-full">
						<UButton @click="navigateTo('/volunteer/emergency-bag/create')" label="Add to bag" color="neutral" variant="outline"
							trailing-icon="i-lucide-plus" />
						<UTable sticky v-model:expanded="expanded" :data="data" :columns="columns"
							:ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }" class="flex-1">
							<template #expanded="{ row }">
								<pre>{{ row.original }}</pre>
							</template>
						</UTable>
					</div>
				</UContainer>
			</div>
		</div>
	</UContainer>
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
	{ header: "Privacy", accessorKey: "privacy", type: "text" },
	{ header: "Expiration Date", accessorKey: "expirationDate", type: "text" },
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

<!-- <template>
	<div>
		<div class="mx-4">
			<UButton label="← Back to Dashboard" class="bg-white text-orange-400" />
			<h1 class="text-2xl font-bold">Manage Emergency Bags</h1>
		</div>
		<div class="mt-4 flex w-full items-center justify-center">
			<UContainer>
				
			</UContainer>
		</div>
	</div>
</template>

<script lang="ts" setup>

</script> -->