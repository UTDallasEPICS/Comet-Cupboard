<template>
	<div class="mx-auto flex w-full flex-col items-center">
		<UStepper
			v-model="active"
			class="w-full"
			:items="stepperItems"
			:orientation="`${smaller ? 'vertical' : 'horizontal'}`"
			:disabled="true"
			:ui="{
				trigger: 'border-1',
				separator: 'bg-black',
				root: `${smaller ? 'flex-col' : ''}`,
			}"
		>
			<template #AddItems>
				<USeparator class="mb-4" />
				<div class="flex flex-col gap-4">
					<BagEditorSearchPanel
						ref="searchPanelRef"
						:inventory-items="volunteerItems"
						:bag-items="bagItems"
						:current-bag-items="currentBagItems"
						@add="addItemToBag"
					/>
					<BagEditorItemsList
						:bag-items="bagItems"
						:current-bag-items="currentBagItems"
						@increase="increaseItemCount"
						@decrease="decreaseItemCount"
						@remove="removeItemFromBag"
					/>
					<div class="flex flex-row justify-end">
						<SharedButtonPositiveAction text="Next" @click="validateAndAdvanceAddItems" />
					</div>
				</div>
			</template>

			<template #BagDetails>
				<USeparator class="mb-4" />
				<div class="flex flex-col gap-4">
					<UCard>
						<template #header>
							<SharedTextCardTitle>Category</SharedTextCardTitle>
						</template>
						<URadioGroup v-model="selectedCategory" size="md" variant="card" :items="categories" />
					</UCard>
					<UCard>
						<template #header>
							<SharedTextCardTitle>Expiry Date</SharedTextCardTitle>
						</template>
						<div class="flex items-center justify-center py-2">
							<UInputDate v-model="expiryDate" size="xl" icon="i-lucide-calendar" :min-value="minDate" />
						</div>
					</UCard>
					<UCard v-if="permissionsStore.canAdminAccess">
						<template #header>
							<SharedTextCardTitle>Privacy</SharedTextCardTitle>
						</template>
						<URadioGroup v-model="selectedPrivacy" size="md" variant="card" :items="privacyOptions" />
					</UCard>
					<UCard v-if="permissionsStore.canAdminAccess">
						<template #header>
							<SharedTextCardTitle>Description</SharedTextCardTitle>
						</template>
						<UTextarea v-model="description" placeholder="Optional bag description" :rows="3" autoresize class="w-full" />
					</UCard>
					<div class="flex flex-row justify-between gap-4">
						<SharedButtonCancel text="Back" @click="decrementStepper" />
						<SharedButtonPositiveAction text="Next" @click="validateAndAdvanceBagDetails" />
					</div>
				</div>
			</template>

			<template #ConfirmBag>
				<USeparator class="mb-4" />
				<div class="flex flex-col gap-4">
					<UCard>
						<template #header>
							<SharedTextCardTitle>Items</SharedTextCardTitle>
						</template>
						<div class="space-y-3">
							<div v-if="bagItems.length === 0 && currentBagItems.length === 0" class="py-4 text-center">
								<p class="text-final-text-soft text-sm">No items in bag</p>
							</div>
							<div v-for="item in [...bagItems, ...currentBagItems]" :key="item.itemID" class="flex items-center gap-3 rounded bg-gray-100 p-3">
								<img v-if="item.imgName" :src="`/api/public/image/${item.imgName}`" :alt="item.name" class="h-10 w-10 rounded object-cover" />
								<div v-else class="h-10 w-10 rounded bg-gray-300" />
								<p class="flex-1 text-sm font-semibold">{{ item.name }}</p>
								<span class="text-sm font-medium tabular-nums">×{{ item.count }}</span>
							</div>
						</div>
					</UCard>
					<UCard>
						<template #header>
							<SharedTextCardTitle>Bag Details</SharedTextCardTitle>
						</template>
						<div class="flex flex-col gap-2 text-sm">
							<p><span class="font-medium">Category:</span> {{ categoryLabel }}</p>
							<p><span class="font-medium">Expiry Date:</span> {{ expiryDate.toString() }}</p>
							<p v-if="permissionsStore.canAdminAccess"><span class="font-medium">Privacy:</span> {{ selectedPrivacy === "private" ? "Private" : "Public" }}</p>
							<p v-if="permissionsStore.canAdminAccess && description"><span class="font-medium">Description:</span> {{ description }}</p>
						</div>
					</UCard>
					<div class="flex flex-row justify-between gap-4">
						<SharedButtonCancel text="Back" @click="decrementStepper" />
						<SharedButtonPositiveAction :text="props.initialData ? 'Update Bag' : 'Confirm Bag'" @click="handleSubmit" />
					</div>
				</div>
			</template>
		</UStepper>
	</div>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui"
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import BagEditorSearchPanel from "~/components/EmergencyBag/BagEditorSearchPanel.vue"
import BagEditorItemsList from "~/components/EmergencyBag/BagEditorItemsList.vue"

const smaller = computed(() => useBreakpoints(breakpointsTailwind).smaller("sm").value)

const stepperItems: StepperItem[] = [
	{ slot: "AddItems" as const, title: "Add Items", icon: icons["shopping"] },
	{ slot: "BagDetails" as const, title: "Bag Details", icon: icons["edit"] },
	{ slot: "ConfirmBag" as const, title: "Confirm Bag", icon: icons["confirmation"] },
]

const categories = [
	{ label: "Veg + PB", value: "VEGETARIAN_AND_PEANUT_BUTTER" },
	{ label: "Veg + Non-PB", value: "VEGETARIAN_AND_NON_PEANUT_BUTTER" },
	{ label: "Non-Veg + PB", value: "NONVEGETARIAN_AND_PEANUT_BUTTER" },
	{ label: "Non-Veg + Non-PB", value: "NONVEGETARIAN_AND_NON_PEANUT_BUTTER" },
]

const privacyOptions = [
	{ label: "Public", value: "public" },
	{ label: "Private", value: "private" },
]

const props = defineProps<{ initialData?: any }>()
const emit = defineEmits(["submit"])

const permissionsStore = usePermissionsStore()
const toast = useToast()

const active = ref(0)
const selectedPrivacy = ref<string | null>("public")
const selectedCategory = ref<string | null>(null)
const description = ref<string>("")

type BagItem = { itemID: string; count: number; name: string; imgName?: string }
const bagItems = ref<BagItem[]>([])
const currentBagItems = ref<BagItem[]>([])

const minDate = today(getLocalTimeZone()).add({ days: 7 })
const expiryDate = shallowRef(minDate)

const categoryLabel = computed(() => categories.find((c) => c.value === selectedCategory.value)?.label ?? "—")

const { data: volunteerItems, refresh: refreshItems } = await useFetch("/api/student/inventory/items")

interface SearchPanelExpose {
	resetSearch: () => void
}
const searchPanelRef = ref<SearchPanelExpose | null>(null)

watchEffect(() => {
	if (!props.initialData) return
	currentBagItems.value = props.initialData.EmergencyBagItems.map((item: any) => ({
		itemID: item.itemID,
		count: item.count,
		name: item.Item.name,
		imgName: item.Item.imgName,
	}))
})

watchEffect(() => {
	if (!props.initialData) return
	const bag = props.initialData
	selectedCategory.value = bag.bagCategory
	selectedPrivacy.value = bag.private ? "private" : null
	description.value = bag.bagDescription ?? ""
	const d = new Date(bag.expiryDate)
	expiryDate.value = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
})

const addItemToBag = (item: any) => {
	const existing = bagItems.value.find((bi) => bi.itemID === item.itemID)
	if (existing) {
		existing.count++
	} else {
		bagItems.value.push({ itemID: item.itemID, count: 1, name: item.name, imgName: item.imgName })
	}
}

const removeItemFromBag = (itemID: string, isCurrentBag = false) => {
	if (isCurrentBag) {
		currentBagItems.value = currentBagItems.value.filter((i) => i.itemID !== itemID)
	} else {
		bagItems.value = bagItems.value.filter((i) => i.itemID !== itemID)
	}
}

const decreaseItemCount = (itemID: string, isCurrentBag = false) => {
	if (isCurrentBag) {
		const item = currentBagItems.value.find((i) => i.itemID === itemID)
		if (!item) return
		if (item.count === 1) {
			currentBagItems.value = currentBagItems.value.filter((i) => i.itemID !== itemID)
		} else {
			item.count--
		}
	} else {
		const item = bagItems.value.find((i) => i.itemID === itemID)
		if (!item) return
		if (item.count === 1) {
			removeItemFromBag(itemID)
		} else {
			item.count--
		}
	}
}

const increaseItemCount = (itemID: string, isCurrentBag = false) => {
	if (isCurrentBag) {
		const item = currentBagItems.value.find((i) => i.itemID === itemID)
		if (!item) return
		const original = props.initialData?.EmergencyBagItems?.find((i: any) => i.itemID === itemID)?.count ?? 0
		if (item.count < original) item.count++
	} else {
		const item = bagItems.value.find((i) => i.itemID === itemID)
		if (item) item.count++
	}
}

const incrementStepper = () => {
	active.value++
}
const decrementStepper = () => {
	active.value--
}

const validateAndAdvanceAddItems = () => {
	if (bagItems.value.length === 0 && currentBagItems.value.length === 0) {
		toast.add({ title: "No items added", description: "Please add at least one item before continuing." })
		return
	}
	incrementStepper()
}

const validateAndAdvanceBagDetails = () => {
	if (!selectedCategory.value) {
		toast.add({ title: "Category required", description: "Please select a category before continuing." })
		return
	}
	if (!expiryDate.value) {
		toast.add({ title: "Expiry date required", description: "Please select an expiry date before continuing." })
		return
	}
	incrementStepper()
}

const resetForm = async () => {
	active.value = 0
	selectedCategory.value = null
	selectedPrivacy.value = "public"
	description.value = ""
	bagItems.value = []
	currentBagItems.value = []
	expiryDate.value = minDate
	searchPanelRef.value?.resetSearch()
	await refreshItems()
}

const handleSubmit = () => {
	emit("submit", {
		_bagCategory: selectedCategory.value,
		_expiryDate: expiryDate.value,
		_items: bagItems.value,
		_oldItems: currentBagItems.value,
		_isPrivate: selectedPrivacy.value === "private",
		_description: description.value,
		_onSuccess: resetForm,
	})
}
</script>
