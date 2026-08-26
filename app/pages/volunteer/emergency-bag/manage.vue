<template>
	<div>
		<NuxtLayout name="main" title="Manage Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="searchQuery" type="text" icon="i-lucide-search" placeholder="Search bags" class="relative grow">
						<SharedButtonActionButton
							leading-icon="i-lucide-plus"
							action="positive"
							text="Add"
							class="absolute right-0"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
					</UInput>
					<EmergencyBagQRCodeModal />
					<UPopover>
						<SharedButtonActionButton icon="i-lucide-sliders-horizontal" button-variant="ghost" action="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleBags" :items="toggleOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Location</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="locationFilter" :items="locationFilterOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Bag Labels</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="emergencyBagLabelFilter" :items="emergencyBagLabelOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Sort</SharedTextBase>
								<USeparator />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow pl-2" />
							</div>
						</template>
					</UPopover>
				</div>
				<USeparator class="my-4" />
				<UCard>
					<div class="flex items-center justify-between gap-3">
						<SharedTextSectionTitle>Emergency Bags</SharedTextSectionTitle>
						<UPopover>
							<SharedButtonActionButton text="Move Bag" class="bg-utd-green" leading-icon="i-lucide-arrow-left-right" />

							<template #content>
								<div class="flex flex-col gap-2 p-4">
									<div>
										<SharedTextBase>Move from:</SharedTextBase>
										<SharedTextBase>{{ selectedLocationLabel }}</SharedTextBase>
										<USeparator />
									</div>
									<div>
										<SharedTextBase>To:</SharedTextBase>
										<UDropdownMenu :items="moveTargetItems" :ui="{ content: 'w-48' }">
											<SharedButtonActionButton
												:text="targetLocationLabel"
												action="neutral"
												variant="outline"
												trailing-icon="i-lucide-chevron-down"
											/>
										</UDropdownMenu>
									</div>
									<SharedButtonActionButton
										text="Confirm Move"
										action="positive"
										leading-icon="i-lucide-check"
										:disabled="!canConfirmMove"
										@click="moveBag"
									/>
								</div>
							</template>
						</UPopover>
					</div>
					<USeparator class="my-4" />
					<div v-if="emergencyBags?.length === 0" class="flex flex-col items-center justify-center gap-y-4 py-8">
						<SharedTextBase>No bags have been created</SharedTextBase>
						<SharedButtonActionButton
							text="Create new bag"
							action="positive"
							variant="outline"
							leading-icon="i-lucide-plus"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
					</div>
					<div v-else class="flex w-full flex-col gap-6">
						<section v-for="group in groupedBags" :key="group.key" class="space-y-3">
							<div class="flex items-center gap-3">
								<SharedTextSectionTitle>{{ group.locationName }}</SharedTextSectionTitle>
								<UBadge :label="String(group.bags.length)" color="neutral" variant="subtle" />
							</div>
							<ul v-if="group.bags.length" class="flex w-full flex-col gap-3">
								<li v-for="bag in group.bags" :key="bag.emergencyBagID" class="w-full">
									<DomainCardEmergencyBagTableBagCard
										:selected="selected[bag.emergencyBagID] ?? false"
										:bag="bag"
										@update:selected="(value) => (selected[bag.emergencyBagID] = value)"
									/>
								</li>
							</ul>
							<SharedTextBaseSecondary v-else>No bags match the current filters at this location</SharedTextBaseSecondary>
						</section>
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const permissionsStore = usePermissionsStore()
const targetLocation = ref<string | null | undefined>(undefined)
const hasChosenTarget = ref(false)
const targetLocationName = ref("")
const selected = ref<Record<string, boolean>>({})
const searchQuery = ref("")
const locationFilter = ref<string[]>([])
const emergencyBagLabelFilter = ref<string[]>([])

const { data: emergencyBags, refresh } = await useFetch("/api/volunteer/emergency-bag")

const { data: locations } = await useFetch("/api/volunteer/location")
const { data: emergencyBagLabels } = await useFetch<{ emergencyBagLabelName: string }[]>("/api/public/emergency-bag/label")

const toggleOptions = computed(() => (permissionsStore.canAdminAccess ? ["Private", "Public"] : ["Public"]))
const toggleBags = ref<string[]>([])
const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Expiration Date"]

const activeLocations = computed(() => (locations.value ?? []).filter((location) => !location.archived))
const locationFilterOptions = computed(() => ["Unassigned", ...activeLocations.value.map((location) => location.locationName)])
const emergencyBagLabelOptions = computed(() => (emergencyBagLabels.value ?? []).map((label) => label.emergencyBagLabelName))
const activeEmergencyBagLabelFilter = computed(() => emergencyBagLabelFilter.value.filter((label) => emergencyBagLabelOptions.value.includes(label)))

const shownBags = computed(() => {
	if (!emergencyBags.value) return []
	return emergencyBags.value.filter((bag) => {
		const matchesPrivacy = toggleBags.value.length === 0 || (bag.private ? toggleBags.value.includes("Private") : toggleBags.value.includes("Public"))
		const locationName = bag.location?.locationName ?? "Unassigned"
		const matchesLocation = locationFilter.value.length === 0 || locationFilter.value.includes(locationName)
		const bagLabels = bag.emergencyBagLabels.filter((label) => !label.archived).map((label) => label.emergencyBagLabelName)
		const matchesLabels = activeEmergencyBagLabelFilter.value.length === 0 || activeEmergencyBagLabelFilter.value.some((label) => bagLabels.includes(label))
		return matchesPrivacy && matchesLocation && matchesLabels
	})
})

const filteredBags = computed(() => {
	const query = searchQuery.value.toLowerCase()
	return shownBags.value.filter((bag) => {
		return bag.label.toLowerCase().includes(query)
	})
})

const sortedBags = computed(() => {
	const sorted = [...filteredBags.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.label.localeCompare(b.label))
	} else if (sortOption.value === "Expiration Date") {
		sorted.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
	}
	return sorted
})

// Every active location is always shown (unless filtered out) so volunteers can move bags into empty locations.
const groupedBags = computed(() => {
	const bagsByLocationKey = new Map<string, typeof sortedBags.value>()
	for (const bag of sortedBags.value) {
		const key = bag.location?.locationID ?? "unassigned"
		bagsByLocationKey.set(key, [...(bagsByLocationKey.get(key) ?? []), bag])
	}

	const groups: { key: string; locationName: string; bags: typeof sortedBags.value }[] = []

	if (locationFilter.value.length === 0 || locationFilter.value.includes("Unassigned")) {
		groups.push({ key: "unassigned", locationName: "Unassigned", bags: bagsByLocationKey.get("unassigned") ?? [] })
	}

	for (const location of activeLocations.value) {
		if (locationFilter.value.length > 0 && !locationFilter.value.includes(location.locationName)) continue
		groups.push({ key: location.locationID, locationName: location.locationName, bags: bagsByLocationKey.get(location.locationID) ?? [] })
	}

	return groups
})

const moveTargetItems = computed<DropdownMenuItem[]>(() => [
	{
		label: "Unassigned",
		onSelect: () => {
			targetLocation.value = null
			targetLocationName.value = "Unassigned"
			hasChosenTarget.value = true
		},
	},
	...activeLocations.value.map((location) => ({
		label: location.locationName,
		onSelect: () => {
			targetLocation.value = location.locationID
			targetLocationName.value = location.locationName
			hasChosenTarget.value = true
		},
	})),
])

const targetLocationLabel = computed(() => (hasChosenTarget.value ? targetLocationName.value : "Choose Location"))

const selectedBags = computed(() =>
	(emergencyBags.value ?? [])
		.filter((bag) => selected.value[bag.emergencyBagID])
		.map((bag) => ({
			emergencyBagID: bag.emergencyBagID,
			currentLocation: bag.location?.locationName,
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

const canConfirmMove = computed(() => selectedBags.value.length > 0 && hasChosenTarget.value)

const moveBag = async () => {
	if (selectedBags.value.length === 0) {
		alert("Please select at least one bag to move")
		return
	}

	if (!hasChosenTarget.value) {
		alert("Please choose a location to move to")
		return
	}

	try {
		await $fetch("/api/volunteer/emergency-bag/multi-move", {
			method: "PUT",
			body: {
				bagIDs: selectedBags.value.map((bag) => bag.emergencyBagID),
				locationID: targetLocation.value,
			},
		})

		await refresh()
		selected.value = {}
		hasChosenTarget.value = false
		targetLocationName.value = ""
	} catch (err: any) {
		console.error("Failed to move bag:", err)
		alert(`Error: ${err.message || "Failed to move bag"}`)
	}
}
</script>
