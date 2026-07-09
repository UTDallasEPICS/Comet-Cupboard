<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
			<SharedTextPageTitle>Create Emergency Bags</SharedTextPageTitle>
		</header>
		<div class="flex justify-center">
			<div class="flex w-full max-w-100 flex-col gap-4">
				<UStepper ref="stepper" :items="steps">
					<template #content="{ item }">
						<EmergencyBagAddItem v-if="item.label === 'Add'" v-model:bag-items="bagItems" />
						<EmergencyBagDetails v-if="item.label === 'Details'" v-model:bag-details="bagDetails" />
						<EmergencyBagConfirmBag v-if="item.label === 'Confirm'" :bag-items="bagItems"
							:bag-details="bagDetails" />
					</template>
				</UStepper>
			</div>
		</div>
		<div class="my-4 flex justify-between">
			<UButton leading-icon="i-lucide-arrow-left" class="bg-final-utd-orange" :disabled="!stepper?.hasPrev"
				@click="stepper?.prev()"> Back </UButton>

			<UButton :trailing-icon="stepper?.hasNext ? 'i-lucide-arrow-right' : ''"
				:class="stepper?.hasNext ? 'bg-final-utd-orange' : 'bg-final-utd-green'"
				@click="stepper?.hasNext ? stepper?.next() : submitBag() ? navigateTo('/volunteer/emergency-bag/manage') : stepper?.prev()">
				{{ stepper?.hasNext ? "Next" : "Confirm Bag" }}
			</UButton>
		</div>
	</UContainer>
</template>

<script lang="ts" setup>
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
	if (!bagDetails.value.selectedCategory) {
		alert("Please select a category")
		return false
	}

	if (!bagDetails.value.expirationDate) {
		alert("Please select an expiration date")
		return false
	}

	if (bagItems.value.length === 0) {
		alert("Please add items to the bag")
		return false
	}

	return true
}

const handleNext = {

}
</script>
