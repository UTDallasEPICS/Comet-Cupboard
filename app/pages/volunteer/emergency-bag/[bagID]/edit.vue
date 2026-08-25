<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Edit bag: ${emergencyBag?.label ?? ''}`"
			:back-navigation="{ text: 'Back to Manage Bags', to: '/volunteer/emergency-bag/manage' }"
		>
			<USeparator class="my-4" />
			<section v-if="emergencyBag" class="mx-auto w-full max-w-xl space-y-4">
				<EmergencyBagAddItem ref="addItemRef" v-model:bag-items="bagItems" />
				<EmergencyBagDetails ref="detailsRef" v-model:bag-details="bagDetails" />
				<div class="flex justify-end">
					<SharedButtonActionButton action="positive" text="Save Changes" :loading="isSaving" @click="saveBag" />
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
const bagDetails = ref<any>({ selectedCategory: [], expirationDate: null, isPrivate: false, bagDescription: "" })

const { data: emergencyBags } = await useFetch<any[]>("/api/volunteer/emergency-bag", {
	query: { emergencyBagID: route.params.bagID },
})
const emergencyBag = computed(() => emergencyBags.value?.[0])

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
			itemLabels: item.specificItem.itemLabels.map((label: any) => label.itemLabelName),
		}))
		bagDetails.value = {
			selectedCategory: bag.emergencyBagLabels.map((label: any) => label.emergencyBagLabelName),
			expirationDate: parseDate(bag.expiryDate.slice(0, 10)),
			isPrivate: bag.private,
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
				labels: bagDetails.value.selectedCategory,
				private: bagDetails.value.isPrivate,
				bagDescription: bagDetails.value.isPrivate ? bagDetails.value.bagDescription : "",
				items: bagItems.value.map((item) => ({ specificItemID: item.specificItemID, count: item.count })),
			},
		})
		await navigateTo("/volunteer/emergency-bag/manage")
	} finally {
		isSaving.value = false
	}
}
</script>
