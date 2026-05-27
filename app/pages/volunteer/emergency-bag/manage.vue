<template>
	<div>
		<NuxtLayout name="main" title="Manage Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<div class="mt-6">
				<!--Tabs-->
				<UTabs
					v-model="activeTab"
					:items="items"
					:ui="{
						root: 'gap-0 border-2 border-final-border-soft rounded-lg',
						trigger: 'rounded-t-lg',
						content: 'rounded-b-lg p-0',
					}"
				>
					<!--Tab Trigger-->
					<template #default="{ item }">
						<div class="flex items-center gap-2" :data-tour="`tab-${item.value}`">
							<span>{{ item.label }}</span>
							<button v-if="item.value === 'edit'" class="hover:cursor-pointer" @click.stop="closeEditTab">✕</button>
						</div>
					</template>

					<!--START OF ADD BAG STUFF-->
					<template #add>
						<div class="pt-4 pl-4">
							<EmergencyBagEditor @submit="submitBag" />
						</div>
					</template>
					<!--END OF ADD BAG STUFF-->

					<!--START OF VIEW/MODIFY BAG STUFF-->
					<template #view>
						<section>
							<div class="flex flex-col gap-2 p-2 md:flex-row md:justify-between">
								<UInput v-model="manage_searchQuery" :icon="icons['search']" placeholder="Search items" class="w-full md:w-72" />
								<div v-if="selectedBagIDs.length > 0" class="flex justify-between">
									<UInputMenu v-model="moveLocation" :items="moveLocations" />
									<UButton :icon="icons['move']" size="xs" variant="solid" @click="moveBags"> Move </UButton>
								</div>
							</div>

							<UTable
								sticky
								v-model:expanded="expanded"
								v-model:rowSelection="selected"
								:getRowId="(row) => row.bagID"
								:data="filtered_viewData"
								:columns="columns"
								:ui="{
									td: 'py-2',
									th: 'py-2',
									tr: 'text-sm',
								}"
							>
								<template #expanded="{ row }">
									<EmergencyBagExpandedRow
										:key="row.original.bagID"
										:bag="row.original"
										:moveLocations="moveLocations"
										:icons="icons"
										@move="moveSingleBag"
										@edit="editBag"
										@delete="deleteBag"
									/>
								</template>
							</UTable>
						</section>
					</template>
					<!--END OF VIEW/MODIFY BAG STUFF-->

					<!--START OF EDIT BAG-->
					<template #edit>
						<EmergencyBagEditor :initialData="editingBag" @submit="submitBag" />
					</template>
					<!--END OF EDIT BAG-->
				</UTabs>
			</div>

			<!-- Alert Modal -->
			<UModal v-model:open="alertModal.open" :dismissible="false">
				<template #content>
					<div class="overflow-hidden rounded-xl shadow-2xl">
						<!-- Colored header bar -->
						<div
							class="flex items-center gap-3 px-6 py-4"
							:class="{
								'bg-final-utd-green': alertModal.type === 'success',
								'bg-final-negative-red': alertModal.type === 'error',
								'bg-final-utd-orange': alertModal.type === 'validation',
							}"
						>
							<span class="text-2xl font-bold text-white">
								<span v-if="alertModal.type === 'success'">✓</span>
								<span v-else-if="alertModal.type === 'error'">✕</span>
								<span v-else>⚠</span>
							</span>
							<h3 class="text-lg font-bold tracking-wide text-white">{{ alertModal.title }}</h3>
						</div>

						<!-- Body -->
						<div class="flex flex-col gap-4 bg-white px-6 py-5">
							<p class="text-final-cancel-gray text-sm leading-relaxed">{{ alertModal.message }}</p>

							<!-- Bag ID highlight (only on successful creation) -->
							<div v-if="alertModal.bagLabel" class="border-final-utd-green flex flex-col gap-1 rounded-lg border-2 bg-green-50 px-4 py-3">
								<span class="text-final-utd-green text-xs font-semibold tracking-widest uppercase">Assigned Bag ID</span>
								<span class="text-final-utd-green text-2xl font-bold tracking-wide">{{ alertModal.bagLabel }}</span>
							</div>

							<div class="flex justify-end">
								<UButton
									size="md"
									class="px-8 font-semibold text-white"
									:class="{
										'bg-final-utd-green hover:brightness-90': alertModal.type === 'success',
										'bg-final-negative-red hover:brightness-90': alertModal.type === 'error',
										'bg-final-utd-orange hover:brightness-90': alertModal.type === 'validation',
									}"
									@click="alertModal.open = false"
								>
									OK
								</UButton>
							</div>
						</div>
					</div>
				</template>
			</UModal>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const resolvedComponents = {
	UButton: resolveComponent("UButton"),
	UCheckbox: resolveComponent("UCheckbox"),
	UDropdownMenu: resolveComponent("UDropdownMenu"),
}

//Tabs Setup
const activeTab = ref("add")

const items = computed(() => {
	const base = [
		{ label: "Add Bag", slot: "add", value: "add" },
		{ label: "View Bags", slot: "view", value: "view" },
	]

	if (editingBag.value) {
		base.push({
			label: `Edit ${editingBag.value.label}`,
			slot: "edit",
			value: "edit",
		})
	}

	return base
})

const closeEditTab = () => {
	editingBag.value = null
	activeTab.value = "view"
}

//Search Query
const manage_searchQuery = ref("")

// Alert modal state
const alertModal = ref({
	open: false,
	type: "success" as "success" | "error" | "validation",
	title: "",
	message: "",
	bagLabel: null as string | null,
})

const showAlert = (type: "success" | "error" | "validation", title: string, message: string, bagLabel: string | null = null) => {
	alertModal.value = { open: true, type, title, message, bagLabel }
}

//Add Tab
//Submit bag
const submitBag = async (data) => {
	const { _bagCategory, _expiryDate, _items, _oldItems, _isPrivate, _description, _onSuccess } = data
	if (!_bagCategory) {
		showAlert("validation", "Missing Category", "Please select a category.")
		return
	}

	if (!_expiryDate) {
		showAlert("validation", "Missing Expiry Date", "Please select an expiry date.")
		return
	}

	if (!_items.length && activeTab.value === "add") {
		showAlert("validation", "No Items Added", "Please add at least one item to the bag.")
		return
	}

	//Convert CalendarDate -> ISO string (midnight UTC)
	const y = _expiryDate.year
	const m = String(_expiryDate.month).padStart(2, "0")
	const d = String(_expiryDate.day).padStart(2, "0")
	const isoDate = new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString()

	try {
		let response
		let message
		let bagLabel: string | null = null
		const isEdit = activeTab.value === "edit"

		if (isEdit) {
			response = await $fetch("/api/volunteer/emergency-bag/emergencyBagEdit", {
				method: "PUT",
				body: {
					bagID: editingBag.value?.bagID,
					bagCategory: _bagCategory,
					expiryDate: isoDate,
					items: _items.map((item) => ({
						itemID: item.itemID,
						count: item.count,
					})),
					oldItems: _oldItems.map((item) => ({
						itemID: item.itemID,
						count: item.count,
					})),
					isPrivate: _isPrivate ?? false,
					bagDescription: _description ?? "",
				},
			})
			message = "The bag has been updated successfully."
			await _onSuccess?.()
			editingBag.value = null
			activeTab.value = "view"
		} else {
			response = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
				method: "POST",
				body: {
					bagCategory: _bagCategory,
					expiryDate: isoDate,
					items: _items.map((item) => ({
						itemID: item.itemID,
						count: item.count,
					})),
					isPrivate: _isPrivate ?? false,
					bagDescription: _description ?? "",
				},
			})
			message = "The bag has been created and is ready for use."
			bagLabel = response?.label ?? null
			await _onSuccess?.()
		}

		// Refresh bags list
		await refreshEmergencyBags()

		showAlert("success", isEdit ? "Bag Updated" : "Bag Created", message, bagLabel)
	} catch (err: any) {
		console.error("Failed to submit bag:", err)
		showAlert("error", "Something Went Wrong", err.message || "Failed to save the bag. Please try again.")
	}
}

//View Tab
const permissionsStore = usePermissionsStore()

const emergencyBagsEndpoint = computed(() => (permissionsStore.canAdminAccess ? "/api/admin/emergency-bag/emergencyBags" : "/api/volunteer/emergency-bag/emergencyBags"))

const { data: emergencyBags, refresh: refreshEmergencyBags } = await useFetch(emergencyBagsEndpoint)
const expanded = ref({})
const selected = ref({})

const { data: _moveLocations } = await useFetch("/api/volunteer/location")
const moveLocations = computed(() => {
	return _moveLocations.value?.map((loc) => loc.name) ?? []
})
const moveLocation = ref("")

const columnsDef = computed(() => {
	const base: any[] = [
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
		{ header: "Category", accessorKey: "bagCategory", type: "text", cell: ({ row }) => categoryMap[row.original.bagCategory] ?? row.original.bagCategory },
		/*{
      type: 'edit',icon: icons['edit'],
      onClick: (row) => {  console.log('To implement...')},
      meta: {class: {th: 'w-12 hidden md:table-cell', td: 'w-12 hidden md:table-cell'}}
    },*/
	]

	if (canAdminAccess.value) {
		base.push({ header: "Private", accessorKey: "private", type: "text", sortable: true, cell: ({ row }) => (row.original.private ? "Yes" : "No") })
	}

	base.push({ type: "expand", meta: { class: { th: "w-12", td: "w-12" } } })

	return base
})

const columns = computed(() => buildNuxtUITable(columnsDef.value, resolvedComponents))

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

const editingBag = ref(null)

const editBag = (bag) => {
	editingBag.value = bag
	activeTab.value = "edit"
}
</script>
