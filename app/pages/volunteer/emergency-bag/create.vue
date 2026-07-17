<template>
	<UContainer>
		<NuxtLayout name="main" title="Create Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }" />
		<div class="flex justify-center">
			<div class="flex w-full max-w-100 flex-col gap-4">
				<UStepper ref="stepper" :items="steps">
					<template #content="{ item }">
						<EmergencyBagAddItem v-if="item.label === 'Add'" v-model:bag-items="bagItems" />
						<EmergencyBagDetails v-if="item.label === 'Details'" v-model:bag-details="bagDetails" />
						<EmergencyBagConfirmBag v-if="item.label === 'Confirm'" :bag-items="bagItems" :bag-details="bagDetails" />
					</template>
				</UStepper>
			</div>
		</div>
		<div class="my-4 flex justify-between">
			<UButton
				leading-icon="i-lucide-arrow-left"
				color="neutral"
				:class="stepper?.hasPrev ? 'bg-utd-orange' : 'bg-gray-500'"
				:disabled="!stepper?.hasPrev"
				@click="stepper?.prev()"
			>
				Back
			</UButton>

			<UButton
				:trailing-icon="stepper?.hasNext ? 'i-lucide-arrow-right' : ''"
				class="bg-utd-green"
				@click="stepper?.hasNext ? stepper?.next() : submitBag()"
			>
				{{ stepper?.hasNext ? "Next" : "Confirm Bag" }}
			</UButton>
		</div>
	</UContainer>
</template>

<script lang="ts" setup>
import { getLocalTimeZone } from "@internationalized/date"
const stepper = ref()
const bagItems = ref<
	{
		itemID: string
		count: number
		name: string
		imgName: string
	}[]
>([])

const bagDetails = ref({
	selectedCategory: [],
	expirationDate: null,
	selectedPrivacy: null,
	bagDescription: "",
})

const steps = [
	{ label: "Add", icon: "i-lucide-shopping-cart", description: "Add Item" },
	{ label: "Details", icon: "i-lucide-square-pen", description: "Bag Details" },
	{ label: "Confirm", icon: "i-lucide-circle-check-big", description: "Confirm Bag" },
]

const submitBag = async () => {
	if (bagItems.value.length === 0) {
		alert("Please add items to the bag")
		stepper.value?.prev()
		stepper.value?.prev()
		return false
	}

	if (!bagDetails.value.expirationDate) {
		alert("Please select an expiration date")
		stepper.value?.prev()
		return false
	}

	if (!bagDetails.value.selectedPrivacy) {
		alert("Please select a privacy type")
		stepper.value?.prev()
		return false
	}

	try {
		const createBag = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
			method: "POST",
			body: {
				bagCategory: bagDetails.value.selectedCategory,
				expiryDate: bagDetails.value.expirationDate.toDate(getLocalTimeZone()).toISOString(),
				privacy: bagDetails.value.selectedPrivacy,
				bagDescription: bagDetails.value.selectedPrivacy === "PRIVATE" ? bagDetails.value.bagDescription : "",
				items: bagItems.value.map((item) => ({
					itemID: item.itemID,
					count: item.count,
				})),
			},
		})

		console.log("Bag successfully created!", createBag)
		navigateTo("/volunteer/emergency-bag/manage")
		return true
	} catch (err: any) {
		console.error("Failed to create bag:", err)
		alert(`Error: ${err.message || "Failed to create bag"}`)
	}
}
</script>
