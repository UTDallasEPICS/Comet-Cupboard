<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="saveProducts" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Specific Products">
			<template #header>
				<SharedButtonActionButton type="button" icon="i-lucide-plus" action="positive" text="Add" aria-label="Add product" @click="addProduct" />
			</template>
			<div class="space-y-4">
			<div v-for="product in orderedProducts" :key="product.key" class="border-border-soft rounded-lg border p-3">
				<div class="mb-3 flex items-center justify-between gap-2">
					<SharedTextBase class="font-semibold">{{ product.productName || "New Product" }}</SharedTextBase>
				</div>
				<div class="space-y-3">
					<UFormField :name="`products.${productIndex(product.key)}.productName`" v-bind="specificProductFormFields.productName" required
						><UInput
							v-model="product.productName"
							:placeholder="specificProductFormFields.productName.placeholder"
							class="w-full"
							:readonly="product.productName === 'Default'"
					/></UFormField>
					<UFormField v-bind="specificProductFormFields.productImage">
						<UFileUpload
							v-model="productImages[product.key]"
							accept=".jpg,.jpeg,.png,.webp"
							label="Upload image"
							class="aspect-square w-full"
							@update:model-value="markImageChanged(product.key)"
						/>
					</UFormField>
					<UFormField :name="`products.${productIndex(product.key)}.itemLabels`" v-bind="specificProductFormFields.itemLabels">
						<USelectMenu
							v-model="product.itemLabels"
							:items="itemLabelOptions"
							multiple
							:placeholder="specificProductFormFields.itemLabels.placeholder"
							class="w-full"
						/>
					</UFormField>
				</div>
			</div>
			</div>
			<SharedFormActions v-if="changesMade" submit-text="Save Changes" class-name="mt-4">
				<template #cancel>
					<SharedButtonActionButton type="button" text="Cancel" action="cancel" @click="cancelChanges" />
				</template>
				<SharedButtonActionButton type="submit" text="Save Changes" leading-icon="i-lucide-check" action="positive" :loading="saving" />
			</SharedFormActions>
		</SharedLayoutSectionUCard>
	</SharedFormShell>
</template>

<script setup lang="ts">
import { specificProductFormFields, specificProductsSchema } from "#shared/utils/formSchemas"
type SpecificProduct = {
	specificItemID: string
	productName: string
	imgName: string
	quantity: number
	itemLabels: { itemLabelName: string; archived: boolean }[]
}
type EditableProduct = Omit<SpecificProduct, "itemLabels"> & { key: string; itemLabels: string[] }

const props = defineProps<{ itemID: string; specificItems: SpecificProduct[]; saving?: boolean; refreshToken?: number }>()
const emit = defineEmits<{ save: [payloads: FormData[]] }>()
const { state, validate, onError } = createFormBuilder(specificProductsSchema, () => ({ products: [] }))
const productState = state as Ref<{ products: EditableProduct[] }>
const { data: itemLabels } = await useFetch<{ itemLabelName: string }[]>("/api/public/inventory/item-label")
const itemLabelOptions = computed(() => (itemLabels.value ?? []).map((label) => label.itemLabelName))
const editableProducts = ref<EditableProduct[]>([])
const originalProducts = ref<EditableProduct[]>([])
const productImages = reactive<Record<string, File | undefined>>({})
const changedImageKeys = ref<Set<string>>(new Set())

const orderedProducts = computed(() =>
	[...editableProducts.value].sort((first, second) => Number(second.productName === "Default") - Number(first.productName === "Default"))
)
const productIndex = (key: string) => editableProducts.value.findIndex((product) => product.key === key)
const changesMade = computed(() => {
	if (editableProducts.value.length !== originalProducts.value.length) return true
	return editableProducts.value.some((product) => {
		const original = originalProducts.value.find((candidate) => candidate.key === product.key)
		return (
			product.productName !== original?.productName ||
			[...product.itemLabels].sort().join("|") !== [...(original?.itemLabels ?? [])].sort().join("|") ||
			changedImageKeys.value.has(product.key)
		)
	})
})

const toEditableProduct = (product: SpecificProduct): EditableProduct => ({
	...product,
	key: product.specificItemID,
	itemLabels: product.itemLabels.map((label) => label.itemLabelName),
})

const hydrateProducts = async () => {
	const products = props.specificItems.map(toEditableProduct)
	originalProducts.value = products.map((product) => ({ ...product, itemLabels: [...product.itemLabels] }))
	editableProducts.value = products.map((product) => ({ ...product, itemLabels: [...product.itemLabels] }))
	productState.value.products = editableProducts.value
	for (const key of Object.keys(productImages)) delete productImages[key]
	changedImageKeys.value = new Set()
	for (const product of products) {
		if (!product.imgName) continue
		try {
			const image = await $fetch<Blob>(`/api/public/image/${product.imgName}`, { responseType: "blob" })
			productImages[product.key] = new File([image], product.imgName, { type: image.type })
		} catch {
			// Leave the file input empty if its persisted image is unavailable.
		}
	}
}

const markImageChanged = (productKey: string) => {
	changedImageKeys.value = new Set([...changedImageKeys.value, productKey])
}

watch(
	() => props.specificItems,
	() => {
		if (!changesMade.value) void hydrateProducts()
	},
	{ immediate: true, deep: true }
)

watch(
	() => props.refreshToken,
	() => void hydrateProducts()
)

const addProduct = () => {
	const key = crypto.randomUUID()
	editableProducts.value.push({ specificItemID: "", key, productName: "", imgName: "", quantity: 0, itemLabels: [] })
	productState.value.products = editableProducts.value
}

const cancelChanges = () => {
	void hydrateProducts()
}

const saveProducts = () => {
	const payloads = editableProducts.value.map((product) => {
		const formData = new FormData()
		if (product.specificItemID) formData.append("specificItemID", product.specificItemID)
		formData.append("itemID", props.itemID)
		formData.append("productName", product.productName.trim())
		formData.append("itemLabels", JSON.stringify(product.itemLabels))
		const selectedImage = productImages[product.key]
		const image = Array.isArray(selectedImage) ? selectedImage[0] : selectedImage
		if (image && changedImageKeys.value.has(product.key)) formData.append("image", image)
		return formData
	})
	emit("save", payloads)
}
</script>
