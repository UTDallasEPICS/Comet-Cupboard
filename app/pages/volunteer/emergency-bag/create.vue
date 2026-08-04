<template>
	<div>
		<NuxtLayout name="main" title="Create Emergency Bags" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<USeparator class="my-4" />
			<div class="flex justify-center">
				<div class="flex w-full max-w-100 flex-col">
					<UStepper ref="stepper" disabled :items="steps">
						<template #content="{ item }">
							<USeparator class="mb-4" />
							<EmergencyBagAddItem v-if="item.label === 'Add'" ref="addItemRef" v-model:bag-items="bagItems" />
							<EmergencyBagDetails v-if="item.label === 'Details'" ref="detailsRef" v-model:bag-details="bagDetails" />
							<EmergencyBagConfirmBag v-if="item.label === 'Confirm'" :bag-items="bagItems" :bag-details="bagDetails" />
						</template>
					</UStepper>
				</div>
			</div>
			<div class="my-4 flex justify-between">
				<UButton
					v-if="stepper?.hasPrev"
					leading-icon="i-lucide-arrow-left"
					color="neutral"
					:class="stepper?.hasPrev ? 'bg-utd-orange' : 'bg-gray-500'"
					:disabled="!stepper?.hasPrev"
					@click="prevStepper()"
				>
					Back
				</UButton>

				<UButton
					:trailing-icon="stepper?.hasNext ? 'i-lucide-arrow-right' : ''"
					class="bg-utd-green ml-auto"
					@click="stepper?.hasNext ? nextStepper() : submitBag()"
				>
					{{ stepper?.hasNext ? "Next" : "Confirm Bag" }}
				</UButton>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import { getLocalTimeZone } from "@internationalized/date"
definePageMeta({ layout: false })
const stepper = ref()
const addItemRef = useTemplateRef("addItemRef")
const detailsRef = useTemplateRef("detailsRef")

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
	isPrivate: null,
	bagDescription: "",
})

const steps = [
	{ label: "Add", icon: "i-lucide-shopping-cart", description: "Add Item" },
	{ label: "Details", icon: "i-lucide-square-pen", description: "Bag Details" },
	{ label: "Confirm", icon: "i-lucide-circle-check-big", description: "Confirm Bag" },
]

const currentStepIndex = ref(0)

const stepValidators = [() => addItemRef.value?.validate() ?? true, () => detailsRef.value?.validate() ?? true, () => true]

const nextStepper = async () => {
	const isValid = await stepValidators[currentStepIndex.value]?.()
	if (!isValid) return
	currentStepIndex.value++
	stepper.value?.next()
}

const prevStepper = () => {
	currentStepIndex.value--
	stepper.value?.prev()
}

const submitBag = async () => {
	const addValid = addItemRef.value?.validate() ?? true
	const detailsValid = await (detailsRef.value?.validate() ?? true)
	if (!addValid || !detailsValid) return false

	try {
		const createBag = await $fetch("/api/volunteer/emergency-bag/emergencyBags", {
			method: "POST",
			body: {
				bagCategory: bagDetails.value.selectedCategory,
				expiryDate: bagDetails.value.expirationDate.toDate(getLocalTimeZone()).toISOString(),
				privacy: bagDetails.value.isPrivate ? "PRIVATE" : "PUBLIC",
				bagDescription: bagDetails.value.isPrivate ? bagDetails.value.bagDescription : "",
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
