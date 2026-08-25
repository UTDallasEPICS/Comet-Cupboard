<template>
	<UCard>
		<div class="flex items-center justify-between gap-3">
			<SharedTextCardTitle>Specific Products</SharedTextCardTitle>
			<SharedButtonActionButton label="Add Product" icon="i-lucide-plus" color="neutral" variant="outline" @click="addProduct" />
		</div>
		<USeparator class="my-4" />
		<div class="space-y-4">
			<div v-for="product in orderedProducts" :key="product.key" class="border-border-soft rounded-lg border p-3">
				<div class="mb-3 flex items-center justify-between gap-2">
					<SharedTextBase class="font-semibold">{{ product.productName || "New Product" }}</SharedTextBase>
					<div class="flex flex-wrap justify-end gap-1">
						<UBadge v-for="label in product.itemLabelNames" :key="label" :label="label" color="neutral" variant="outline" />
						<UBadge v-if="product.specificItemID" :label="`Quantity: ${product.quantity}`" color="neutral" variant="outline" />
					</div>
				</div>
				<div class="space-y-3">
					<UFormField label="Product Name" required
						><UInput v-model="product.productName" class="w-full" :readonly="product.productName === 'Default'"
					/></UFormField>
					<UFormField label="Product Image" description="JPG, PNG, or WEBP. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels">
						<UFileUpload
							v-model="productImages[product.key]"
							accept=".jpg,.jpeg,.png,.webp"
							label="Upload image"
							class="aspect-square w-full"
							@update:model-value="markImageChanged(product.key)"
						/>
					</UFormField>
					<UFormField label="Item Labels">
						<USelectMenu v-model="product.itemLabelNames" :items="itemLabelOptions" multiple placeholder="Select labels" class="w-full" />
					</UFormField>
				</div>
			</div>
		</div>
		<div v-if="changesMade" class="mt-4 flex justify-end gap-2">
			<SharedButtonActionButton label="Cancel" color="neutral" variant="outline" @click="cancelChanges" />
			<SharedButtonActionButton label="Save Changes" color="secondary" :loading="saving" @click="saveProducts" />
		</div>
	</UCard>
</template>

<script setup lang="ts">
type SpecificProduct = {
	specificItemID: string
	productName: string
	imgName: string
	quantity: number
	itemLabels: { itemLabelName: string }[]
}
type EditableProduct = Omit<SpecificProduct, "itemLabels"> & { key: string; itemLabelNames: string[] }

const props = defineProps<{ itemID: string; specificItems: SpecificProduct[]; saving?: boolean }>()
const emit = defineEmits<{ save: [payloads: FormData[]] }>()
const itemLabelOptions = ["Gluten Free", "Halal", "Kosher", "Vegan", "Vegetarian"]
const editableProducts = ref<EditableProduct[]>([])
const originalProducts = ref<EditableProduct[]>([])
const productImages = reactive<Record<string, File | undefined>>({})
const changedImageKeys = ref<Set<string>>(new Set())

const orderedProducts = computed(() =>
	[...editableProducts.value].sort((first, second) => Number(second.productName === "Default") - Number(first.productName === "Default"))
)
const changesMade = computed(() => {
	if (editableProducts.value.length !== originalProducts.value.length) return true
	return editableProducts.value.some((product) => {
		const original = originalProducts.value.find((candidate) => candidate.key === product.key)
		return (
			product.productName !== original?.productName ||
			[...product.itemLabelNames].sort().join("|") !== [...(original?.itemLabelNames ?? [])].sort().join("|") ||
			changedImageKeys.value.has(product.key)
		)
	})
})

const toEditableProduct = (product: SpecificProduct): EditableProduct => ({
	...product,
	key: product.specificItemID,
	itemLabelNames: product.itemLabels.map((label) => label.itemLabelName),
})

const hydrateProducts = async () => {
	const products = props.specificItems.map(toEditableProduct)
	originalProducts.value = products.map((product) => ({ ...product, itemLabelNames: [...product.itemLabelNames] }))
	editableProducts.value = products.map((product) => ({ ...product, itemLabelNames: [...product.itemLabelNames] }))
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

const addProduct = () => {
	const key = crypto.randomUUID()
	editableProducts.value.push({ specificItemID: "", key, productName: "", imgName: "", quantity: 0, itemLabelNames: [] })
}

const cancelChanges = () => {
	void hydrateProducts()
}

const saveProducts = () => {
	if (editableProducts.value.some((product) => !product.productName.trim())) return
	const payloads = editableProducts.value.map((product) => {
		const formData = new FormData()
		if (product.specificItemID) formData.append("specificItemID", product.specificItemID)
		formData.append("itemID", props.itemID)
		formData.append("productName", product.productName.trim())
		formData.append("itemLabels", JSON.stringify(product.itemLabelNames))
		const selectedImage = productImages[product.key]
		const image = Array.isArray(selectedImage) ? selectedImage[0] : selectedImage
		if (image && changedImageKeys.value.has(product.key)) formData.append("image", image)
		return formData
	})
	emit("save", payloads)
}
</script>
