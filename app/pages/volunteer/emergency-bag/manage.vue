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
						<UButton
							label="Add to bag"
							color="neutral"
							variant="outline"
							trailing-icon="i-lucide-plus"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
						<UPopover>
							<UButton label="Move Bag" class="bg-utd-green" trailing-icon="i-lucide-arrow-left-right" />

							<template #content>
								<div class="flex flex-col gap-2 p-4">
									<div>
										<p>Move from:</p>
										<span>{{ selectedLocationLabel }}</span>
										<hr />
									</div>
									<div>
										<p>To:</p>
										<UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
											<UButton label="Choose Location" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
										</UDropdownMenu>
									</div>
								</div>
							</template>
						</UPopover>
						<UButton label="Delete Bag" class="bg-red-500" trailing-icon="i-lucide-trash" @click="deleteBag" />
						<UTable
							v-model:expanded="expanded"
							v-model:row-selection="selected"
							sticky
							:data="tableData"
							:columns="columns"
							:ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
							class="flex-1"
							@select="(_, row) => row.toggleExpanded()"
						>
							<template #expanded="{ row }">
								<div class="flex w-full justify-center">
									<div class="mr-40 flex flex-col items-center justify-between">
										<h2 class="text-lg font-bold">Items:</h2>
										<div class="w-100">
											<UCarousel
												v-slot="{ item }"
												class="mb-6"
												loop
												arrows
												dots
												:items="row.original.items"
												:ui="{
													item: 'basis-1/3',
												}"
											>
												<EmergencyBagCarouselCards
													:key="item.itemID"
													:name="item.name"
													:img-name="item.imgName"
													:item-deal="item.itemDeal"
													:item-id="item.itemID"
													:item-count="item.count"
												/>
											</UCarousel>
										</div>
									</div>
									<div class="flex flex-col gap-2">
										<div class="flex gap-2 text-lg">
											<h2 class="text-lg font-bold">BagID:</h2>
											<span>{{ row.original.bagID }}</span>
										</div>
										<div class="flex items-center gap-2 text-lg">
											<h2 class="text-lg font-bold">Location:</h2>
											<span>{{ !row.original.location ? "Unassigned" : row.original.location }}</span>
										</div>
										<div class="flex items-center gap-2 text-lg">
											<h2 class="text-lg font-bold">Labels:</h2>
											<div class="flex items-center justify-center gap-1">
												<UBadge v-if="row.original.label.length === 0" class="rounded-full bg-gray-400 font-bold" label="Neither" />

												<UBadge
													v-for="label in row.original.label"
													:key="label"
													:label="label"
													:class="
														label === 'Vegetarian' ? 'rounded-full bg-green-700 font-bold' : 'rounded-full bg-yellow-600 font-bold'
													"
												/>
											</div>
										</div>
										<div class="flex items-center gap-2 text-lg">
											<h2 class="text-lg font-bold">Privacy:</h2>
											<span>{{ row.original.privacy }}</span>
										</div>
										<div class="flex items-center gap-2 text-lg">
											<h2 class="text-lg font-bold">Expiration Date:</h2>
											<span>{{ row.original.expirationDate.split("T")[0] }}</span>
										</div>
										<h2 class="mt-4 text-lg font-bold">Bag Description:</h2>
										<p class="text-lg">{{ row.original.bagDescription }}</p>
									</div>
								</div>
							</template>
						</UTable>
					</div>
				</UContainer>
			</div>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue"

const UButton = resolveComponent("UButton")
const UBadge = resolveComponent("UBadge")
const UCheckbox = resolveComponent("UCheckbox")

const targetLocation = ref<string | null>(null)

const expanded = ref({})
const selected = ref({})

const { data: emergencyBags, refresh } = await useFetch("/api/volunteer/emergency-bag/emergencyBags")

const { data: locations } = await useFetch("/api/volunteer/location")

console.log("API: ", emergencyBags.value)
console.log("Location API: ", locations.value)

const tableData = computed(() =>
	(emergencyBags.value ?? []).map((bag) => {
		const label: string[] = []
		if (bag.isVegetarian) label.push("Vegetarian")
		if (bag.hasPeanutButter) label.push("Peanut Butter")

		return {
			...bag,
			label,
		}
	})
)

console.log("Data: ", tableData.value)

const items = computed<DropdownMenuItem[]>(() =>
	locations.value
		.filter((loc) => !loc.archived)
		.map((loc) => ({
			label: loc.name,
			onSelect: () => {
				targetLocation.value = loc.name
				moveBag()
			},
		}))
)

const columns = [
	{
		id: "select",
		header: ({ table }) =>
			h(UCheckbox, {
				modelValue: table.getIsSomePageRowsSelected() ? "indeterminate" : table.getIsAllPageRowsSelected(),
				"onUpdate:modelValue": (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
				"aria-label": "Select all",
			}),
		cell: ({ row }) =>
			h(UCheckbox, {
				modelValue: row.getIsSelected(),
				"onUpdate:modelValue": (value: boolean | "indeterminate") => row.toggleSelected(!!value),
				"aria-label": "Select row",
			}),
	},
	{
		accessorKey: "bagID",
		header: "Bag ID",
		cell: ({ row }) => `${row.getValue("bagID")}`,
	},
	{
		accessorKey: "location",
		header: "Location",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => row.original.location ?? "Unassigned",
	},
	{
		accessorKey: "expirationDate",
		header: "Expiration Date",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => {
			return new Date(row.getValue("expirationDate")).toLocaleString("en-US", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		},
	},
	{
		accessorKey: "privacy",
		header: "Privacy",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => row.original.privacy,
	},
	{
		accessorKey: "items",
		header: "Item Count",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => row.original.items.length,
	},
	// {
	// 	accessorKey: "label",
	// 	header: "Label",
	// 	cell: ({ row }) => {
	// 		const labels = row.original.label
	// 		if (labels.length === 0) {
	// 			return h(UBadge, { class: "rounded-full font-bold bg-gray-400", label: "Neither" })
	// 		}

	// 		return h(
	// 			"div",
	// 			{ class: "flex gap-1 items-center" },
	// 			labels.map((label) => {
	// 				if (label === "Vegetarian") {
	// 					return h(UBadge, { class: "rounded-full font-bold bg-green-700", label: "Vegetarian" })
	// 				}
	// 				if (label === "Peanut Butter") {
	// 					return h(UBadge, { class: "rounded-full font-bold bg-yellow-600", label: "Peanut Butter" })
	// 				}
	// 			})
	// 		)
	// 	},
	// },
]

const selectedBags = computed(() =>
	tableData.value
		.filter((_, index) => selected.value[index])
		.map((bag) => ({
			bagID: bag.bagID,
			currentLocation: bag.location,
		}))
)

const selectedLocationLabel = computed(() => {
	if (selectedBags.value.length === 0) {
		return "No bags selected"
	}

	const distinctLocations = new Set(selectedBags.value.map((bag) => bag.currentLocation ?? "Unassigned"))

	if (distinctLocations.size === 1) {
		return [...distinctLocations][0]
	}

	return "Multiple Locations"
})

const moveBag = async () => {
	if (selectedBags.value.length === 0) {
		alert("Please select at least one bag to move")
		return
	}

	try {
		const moveBag = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
			method: "PATCH",
			body: {
				bagIDs: selectedBags.value.map((bag) => bag.bagID),
				location: targetLocation.value,
			},
		})

		console.log("Bag successfully moved!", moveBag)
		await refresh()
		selected.value = {}
	} catch (err: any) {
		console.error("Failed to move bag:", err)
		alert(`Error: ${err.message || "Failed to move bag"}`)
	}
}

const deleteBag = async () => {
	if (selectedBags.value.length === 0) {
		alert("Please select at least one bag to delete")
		return
	}

	try {
		const moveBag = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
			method: "DELETE",
			body: {
				bagIDs: selectedBags.value.map((bag) => bag.bagID),
			},
		})

		console.log("Bag successfully deleted!", moveBag)
		await refresh()
		selected.value = {}
	} catch (err: any) {
		console.error("Failed to delete bag:", err)
		alert(`Error: ${err.message || "Failed to delete bag"}`)
	}
}
</script>
