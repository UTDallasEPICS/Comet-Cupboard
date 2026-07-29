<template>
	<UContainer>
		<NuxtLayout name="main" title="Manage Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }" />
		<div class="flex items-center justify-center">
			<UCard class="w-full max-w-100">
				<div class="mb-2 flex justify-between">
					<UButton
						v-if="emergencyBags.length >= 1"
						label="Create new bag"
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
					<EmergencyBagTableBagCard v-for="bag in emergencyBags" :key="bag.bagID" v-model:selected="selected[bag.bagID]" :bag="bag" />
				</div>
			</UCard>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue"

const UButton = resolveComponent("UButton")
const targetLocation = ref<string | null>(null)
const selected = ref<Record<string, boolean>>({})

const { data: emergencyBags, refresh } = await useFetch("/api/volunteer/emergency-bag/emergencyBags")

const { data: locations } = await useFetch("/api/volunteer/location")

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
