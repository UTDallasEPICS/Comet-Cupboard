<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Edit bag: ${emergencyBag?.label ?? ''}`"
			:back-navigation="{ text: 'Back to Manage Bags', to: '/volunteer/emergency-bag/manage' }"
		>
			<USeparator class="my-4" />
			<section v-if="emergencyBag" class="mx-auto w-full max-w-3xl space-y-4">
				<EmergencyBagEditorAddItemForm ref="addItemRef" :items="itemsForAddForm" v-model:bag-items="bagItems" />
				<EmergencyBagEditorDetailsForm ref="detailsRef" v-model:bag-details="bagDetails" />
				<div class="flex justify-end">
					<SharedButtonActionButton action="positive" text="Save Changes" leading-icon="i-lucide-check" :loading="isSaving" @click="saveBag" />
				</div>
			</section>
			<div v-else class="py-12 text-center"><SharedTextBase>Emergency bag not found.</SharedTextBase></div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })
import { getLocalTimeZone, parseDate } from "@internationalized/date"

const route = useRoute()
const addItemRef = useTemplateRef("addItemRef")
const detailsRef = useTemplateRef("detailsRef")
const isSaving = ref(false)
const bagItems = ref<any[]>([])
const bagDetails = ref<any>({ labels: [], expirationDate: null, private: false, bagDescription: "" })

const { data: emergencyBags } = await useFetch<any[]>("/api/volunteer/emergency-bag", {
	query: { emergencyBagID: route.params.bagID },
})
const emergencyBag = computed(() => emergencyBags.value?.[0])

const { data: inventoryItems } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "false" },
})

// Reserved counts from this bag are already subtracted from inventory, so add them back for accurate availability.
const itemsForAddForm = computed(() => {
	if (!emergencyBag.value) return inventoryItems.value ?? []
	const reservedBySpecificItemID = new Map(emergencyBag.value.emergencyBagItems.map((item: any) => [item.specificItemID, item.count]))
	return (inventoryItems.value ?? []).map((item: any) => ({
		...item,
		specificItems: item.specificItems.map((specificItem: any) => ({
			...specificItem,
			quantity: Number(specificItem.quantity) + (reservedBySpecificItemID.get(specificItem.specificItemID) ?? 0),
		})),
	}))
})

watch(
	emergencyBag,
	(bag) => {
		if (!bag) return
		bagItems.value = bag.emergencyBagItems.map((item: any) => ({
			specificItemID: item.specificItemID,
			count: item.count,
			name: item.specificItem.item.itemName,
			productName: item.specificItem.productName,
			imgName: item.specificItem.imgName,
			quantity: Number(item.specificItem.quantity) + item.count,
			itemLabels: item.specificItem.itemLabels.filter((label: any) => !label.archived).map((label: any) => label.itemLabelName),
		}))
		bagDetails.value = {
			labels: bag.emergencyBagLabels.map((label: any) => label.emergencyBagLabelName),
			expirationDate: parseDate(bag.expiryDate.slice(0, 10)),
			private: bag.private,
			bagDescription: bag.bagDescription ?? "",
		}
	},
	{ immediate: true }
)

const saveBag = async () => {
	const addItemsValid = addItemRef.value?.validate() ?? true
	const detailsValid = await (detailsRef.value?.validate() ?? true)
	if (!addItemsValid || !detailsValid || !emergencyBag.value) return

	isSaving.value = true
	try {
		await $fetch("/api/volunteer/emergency-bag/emergency-bag", {
			method: "PUT",
			body: {
				emergencyBagID: emergencyBag.value.emergencyBagID,
				expiryDate: bagDetails.value.expirationDate.toDate(getLocalTimeZone()).toISOString(),
				labels: bagDetails.value.labels,
				private: bagDetails.value.private,
				bagDescription: bagDetails.value.private ? bagDetails.value.bagDescription : "",
				items: bagItems.value.map((item) => ({ specificItemID: item.specificItemID, count: item.count })),
			},
		})
		await navigateTo("/volunteer/emergency-bag/manage")
	} finally {
		isSaving.value = false
	}
}
</script>
