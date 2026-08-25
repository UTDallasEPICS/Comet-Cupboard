<template>
	<div>
		<NuxtLayout name="main" title="Manage Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="searchQuery" type="text" icon="i-lucide-search" placeholder="Search bags" class="relative grow">
						<SharedButtonActionButton
							icon="i-lucide-plus"
							color="secondary"
							label="Add"
							class="absolute right-0"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
					</UInput>
					<UPopover>
						<SharedButtonActionButton icon="i-lucide-sliders-horizontal" variant="ghost" color="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleBags" :items="toggleOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Location</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="locationFilter" :items="locationFilterOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Bag Labels</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="emergencyBagLabelFilter" :items="emergencyBagLabelOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Sort</SharedTextBase>
								<USeparator />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow" />
							</div>
						</template>
					</UPopover>
				</div>
				<USeparator class="my-4" />
				<UCard>
					<div class="flex items-center justify-between gap-3">
						<SharedTextSectionTitle>Emergency Bags</SharedTextSectionTitle>
						<UPopover>
							<SharedButtonActionButton label="Move Bag" class="bg-utd-green" trailing-icon="i-lucide-arrow-left-right" />

							<template #content>
								<div class="flex flex-col gap-2 p-4">
									<div>
										<SharedTextBase>Move from:</SharedTextBase>
										<SharedTextBase>{{ selectedLocationLabel }}</SharedTextBase>
										<USeparator />
									</div>
									<div>
										<SharedTextBase>To:</SharedTextBase>
										<UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
											<SharedButtonActionButton
												label="Choose Location"
												color="neutral"
												variant="outline"
												trailing-icon="i-lucide-chevron-down"
											/>
										</UDropdownMenu>
									</div>
								</div>
							</template>
						</UPopover>
					</div>
					<USeparator class="my-4" />
					<div v-if="groupedBags.length === 0" class="flex flex-col items-center justify-center gap-y-4 py-8">
						<SharedTextBase>{{ emergencyBags?.length ? "No bags match the current filters" : "No bags have been created" }}</SharedTextBase>
						<SharedButtonActionButton
							label="Create new bag"
							color="neutral"
							variant="outline"
							trailing-icon="i-lucide-plus"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
					</div>
					<div v-else class="flex w-full flex-col gap-6">
						<section v-for="group in groupedBags" :key="group.locationName" class="space-y-3">
							<div class="flex items-center gap-3">
								<SharedTextSectionTitle>{{ group.locationName }}</SharedTextSectionTitle>
								<UBadge :label="String(group.bags.length)" color="neutral" variant="subtle" />
							</div>
							<ul class="flex w-full flex-col gap-3">
								<li v-for="bag in group.bags" :key="bag.emergencyBagID" class="w-full">
									<DomainCardEmergencyBagTableBagCard v-model:selected="selected[bag.emergencyBagID]" :bag="bag" />
								</li>
							</ul>
						</section>
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { resolveComponent } from "vue"
definePageMeta({ layout: false })
const UButton = resolveComponent("UButton")
const targetLocation = ref<string | null>(null)
const selected = ref<Record<string, boolean>>({})
const searchQuery = ref("")
const locationFilter = ref<string[]>([])
const emergencyBagLabelFilter = ref<string[]>([])

const { data: emergencyBags, refresh } = await useFetch("/api/volunteer/emergency-bag")

const { data: locations } = await useFetch("/api/volunteer/location")

const toggleOptions = ref(["Private", "Public"])
const toggleBags = ref<string[]>([])
const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Expiration Date"]

const locationFilterOptions = computed(() => [
	"Unassigned",
	...(locations.value ?? []).filter((location) => !location.archived).map((location) => location.locationName),
])
const emergencyBagLabelOptions = computed(() => {
	const labels = (emergencyBags.value ?? []).flatMap((bag) => bag.emergencyBagLabels.map((label) => label.emergencyBagLabelName))
	return [...new Set(labels)].sort((first, second) => first.localeCompare(second))
})

const shownBags = computed(() => {
	if (!emergencyBags.value) return []
	return emergencyBags.value.filter((bag) => {
		const matchesPrivacy = toggleBags.value.length === 0 || (bag.private ? toggleBags.value.includes("Private") : toggleBags.value.includes("Public"))
		const locationName = bag.location?.locationName ?? "Unassigned"
		const matchesLocation = locationFilter.value.length === 0 || locationFilter.value.includes(locationName)
		const bagLabels = bag.emergencyBagLabels.map((label) => label.emergencyBagLabelName)
		const matchesLabels = emergencyBagLabelFilter.value.length === 0 || emergencyBagLabelFilter.value.some((label) => bagLabels.includes(label))
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

const groupedBags = computed(() => {
	const groups = new Map<string, typeof sortedBags.value>()
	for (const bag of sortedBags.value) {
		const locationName = bag.location?.locationName ?? "Unassigned"
		groups.set(locationName, [...(groups.get(locationName) ?? []), bag])
	}

	return [...groups.entries()]
		.sort(([firstLocation], [secondLocation]) => {
			if (firstLocation === "Unassigned") return -1
			if (secondLocation === "Unassigned") return 1
			return firstLocation.localeCompare(secondLocation)
		})
		.map(([locationName, bags]) => ({ locationName, bags }))
})

const items = computed<DropdownMenuItem[]>(() =>
	locations.value
		.filter((loc) => !loc.archived)
		.map((loc) => ({
			label: loc.locationName,
			onSelect: () => {
				targetLocation.value = loc.locationID
				moveBag()
			},
		}))
)

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

const moveBag = async () => {
	if (selectedBags.value.length === 0) {
		alert("Please select at least one bag to move")
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
	} catch (err: any) {
		console.error("Failed to move bag:", err)
		alert(`Error: ${err.message || "Failed to move bag"}`)
	}
}
</script>
