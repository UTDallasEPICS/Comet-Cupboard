<template>
	<div>
		<NuxtLayout name="main" title="Manage Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<USeparator class="my-4" />
			<div class="flex items-center justify-center">
				<UCard class="w-full max-w-100">
					<div class="mb-2 flex justify-between">
						<div class="flex flex-row flex-nowrap items-center gap-2">
							<UInput v-model="searchQuery" type="text" :icon="icons['search']" placeholder="Search items" class="relative grow">
								<UButton
									:icon="icons['add']"
									variant="ghost"
									color="neutral"
									class="absolute bg-utd-green text-white right-0"
									@click="navigateTo('/volunteer/emergency-bag/create')"
								/>
							</UInput>
							<UPopover>
								<UButton :icon="icons['sortFilter']" variant="ghost" color="neutral" size="md" />

								<template #content>
									<div class="flex w-64 flex-col items-start gap-2 p-4">
										<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
										<USeparator />
										<UCheckboxGroup v-model="toggleBags" :items="toggleOptions" orientation="vertical" />
										<SharedTextBase class="w-full font-semibold">Sort</SharedTextBase>
										<USeparator />
										<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow" />
									</div>
								</template>
							</UPopover>
						</div>
						<UPopover>
							<UButton label="Move Bag" class="bg-utd-green" trailing-icon="i-lucide-arrow-left-right" />

							<template #content>
								<div class="flex flex-col gap-2 p-4">
									<div>
										<p>Move from:</p>
										<span>{{ selectedLocationLabel }}</span>
										<USeparator />
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
					</div>
					<!-- <UButton label="Delete Bag" class="bg-red-500" trailing-icon="i-lucide-trash" @click="deleteBag" /> -->

					<div v-if="emergencyBags.length === 0" class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No bags have been created </SharedTextBase>
						<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
						<UButton
							label="Create new bag"
							color="neutral"
							variant="outline"
							trailing-icon="i-lucide-plus"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
					</div>
					<div class="flex flex-col gap-2">
						<EmergencyBagTableBagCard v-for="bag in sortedBags" :key="bag.bagID" v-model:selected="selected[bag.bagID]" :bag="bag" />
					</div>
				</UCard>
			</div>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue"
definePageMeta({ layout: false })
const UButton = resolveComponent("UButton")
const targetLocation = ref<string | null>(null)
const selected = ref<Record<string, boolean>>({})
const searchQuery = ref("")

const { data: emergencyBags, refresh } = await useFetch("/api/volunteer/emergency-bag/emergencyBags")

console.log("emergencyBags: ", emergencyBags.value)

const { data: locations } = await useFetch("/api/volunteer/location")

const toggleOptions = ref(["Vegetarian", "Peanut Butter", "Private", "Public"])
const toggleBags = ref<string[]>([])
const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Expiration Date", "Location", "Item Count"]

const shownBags = computed(() => {
	if (!emergencyBags.value) return []
	return emergencyBags.value.filter((bag) => {
		return (
			(!toggleBags.value.includes("Vegetarian") || bag.isVegetarian) &&
			(!toggleBags.value.includes("Peanut Butter") || bag.hasPeanutButter) &&
			(!toggleBags.value.includes("Private") || bag.privacy === "PRIVATE") &&
			(!toggleBags.value.includes("Public") || bag.privacy === "PUBLIC")
		)
	})
})

const filteredBags = computed(() => {
	const query = searchQuery.value.toLowerCase()
	return shownBags.value.filter((bag) => {
		return bag.label.toLowerCase().includes(query)
	})
})

const sortedBags = computed(() => {
	if (!filteredBags.value) {
		return []
	}
	const sorted = [...filteredBags.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.label.localeCompare(b.label))
	} else if (sortOption.value === "Expiration Date") {
		sorted.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
	} else if (sortOption.value === "Location") {
		sorted.sort((a, b) => (a.locationName ?? "Unassigned").localeCompare(b.locationName ?? "Unassigned"))
	} else if (sortOption.value === "Item Count") {
		sorted.sort((a, b) => a.EmergencyBagItems.length - b.EmergencyBagItems.length)
	}
	return sorted
})

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

const selectedBags = computed(() =>
	(emergencyBags.value ?? [])
		.filter((bag) => selected.value[bag.bagID])
		.map((bag) => ({
			bagID: bag.bagID,
			currentLocation: bag.locationName,
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

// const deleteBag = async () => {
// 	if (selectedBags.value.length === 0) {
// 		alert("Please select at least one bag to delete")
// 		return
// 	}

// 	try {
// 		const moveBag = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
// 			method: "DELETE",
// 			body: {
// 				bagIDs: selectedBags.value.map((bag) => bag.bagID),
// 			},
// 		})

// 		console.log("Bag successfully deleted!", moveBag)
// 		await refresh()
// 		selected.value = {}
// 	} catch (err: any) {
// 		console.error("Failed to delete bag:", err)
// 		alert(`Error: ${err.message || "Failed to delete bag"}`)
// 	}
// }
</script>
