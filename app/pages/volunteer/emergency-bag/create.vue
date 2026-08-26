<template>
	<div>
		<NuxtLayout
			name="main"
			title="Create Emergency Bags"
			:back-navigation="{ text: 'Back to Manage Emergency Bags', to: '/volunteer/emergency-bag/manage' }"
		>
			<div class="flex justify-center">
				<div class="flex w-full max-w-3xl flex-col">
					<UStepper ref="stepper" disabled :items="steps">
						<template #content="{ item }">
							<USeparator class="mb-4" />
							<EmergencyBagEditorAddItemForm
								v-if="item.label === 'Add'"
								ref="addItemRef"
								:items="inventoryItems ?? []"
								v-model:bag-items="bagItems"
							/>
							<EmergencyBagEditorDetailsForm v-if="item.label === 'Details'" ref="detailsRef" v-model:bag-details="bagDetails" />
							<EmergencyBagEditorConfirmBagForm v-if="item.label === 'Confirm'" :bag-items="bagItems" :bag-details="bagDetails" />
						</template>
					</UStepper>
				</div>
			</div>
			<div class="my-4 flex justify-between">
				<SharedButtonActionButton
					v-if="stepper?.hasPrev"
					leading-icon="i-lucide-arrow-left"
					action="neutral"
					:class="stepper?.hasPrev ? 'bg-utd-orange' : 'bg-gray-500'"
					:disabled="!stepper?.hasPrev"
					@click="prevStepper()"
				>
					Back
				</SharedButtonActionButton>

				<SharedButtonActionButton
					:trailing-icon="stepper?.hasNext ? 'i-lucide-arrow-right' : ''"
					class="bg-utd-green ml-auto"
					@click="stepper?.hasNext ? nextStepper() : submitBag()"
				>
					{{ stepper?.hasNext ? "Next" : "Confirm Bag" }}
				</SharedButtonActionButton>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import { getLocalTimeZone, parseDate } from "@internationalized/date"
definePageMeta({ layout: false })
const stepper = ref()
const addItemRef = useTemplateRef("addItemRef")
const detailsRef = useTemplateRef("detailsRef")
const route = useRoute()
const { data: inventoryItems } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "true" },
})

const bagItems = ref<
	{
		specificItemID: string
		count: number
		name: string
		productName: string
		imgName: string
		quantity: number
		itemLabels: string[]
	}[]
>([])

const bagDetails = ref({
	labels: [] as string[],
	expirationDate: null,
	private: false,
	bagDescription: "",
})

if (route.query.duplicateFrom) {
	const sourceBags = await $fetch<any[]>("/api/volunteer/emergency-bag", {
		query: { emergencyBagID: route.query.duplicateFrom },
	})
	const sourceBag = sourceBags[0]
	if (sourceBag) {
		bagItems.value = sourceBag.emergencyBagItems.map((item: any) => ({
			specificItemID: item.specificItemID,
			count: item.count,
			name: item.specificItem.item.itemName,
			productName: item.specificItem.productName,
			imgName: item.specificItem.imgName,
			quantity: Number(item.specificItem.quantity),
			itemLabels: item.specificItem.itemLabels.filter((label: any) => !label.archived).map((label: any) => label.itemLabelName),
		}))
		bagDetails.value.labels = sourceBag.emergencyBagLabels.map((label: any) => label.emergencyBagLabelName)
		bagDetails.value.private = sourceBag.private
		bagDetails.value.bagDescription = sourceBag.bagDescription || ""
		bagDetails.value.expirationDate = parseDate(sourceBag.expiryDate.slice(0, 10))
	}
}

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
		await $fetch("/api/volunteer/emergency-bag/emergency-bag", {
			method: "PUT",
			body: {
				labels: bagDetails.value.labels,
				expiryDate: bagDetails.value.expirationDate.toDate(getLocalTimeZone()).toISOString(),
				private: bagDetails.value.private ?? false,
				bagDescription: bagDetails.value.private ? bagDetails.value.bagDescription : "",
				items: bagItems.value.map((item) => ({
					specificItemID: item.specificItemID,
					count: item.count,
				})),
			},
		})

		navigateTo("/volunteer/emergency-bag/manage")
		return true
	} catch (err: any) {
		console.error("Failed to create bag:", err)
		alert(`Error: ${err.message || "Failed to create bag"}`)
	}
}
</script>
