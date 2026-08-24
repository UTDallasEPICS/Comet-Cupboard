<template>
	<UCard class="relative w-full min-w-72 overflow-hidden shadow-md" :ui="{ body: 'p-0 sm:p-0' }">
		<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />
		<div class="flex min-h-24 items-center gap-4 p-4">
			<img
				:src="`/api/public/image/${imgName}`"
				:alt="specificItemName(specificItem)"
				class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover"
			/>

			<div class="min-w-0">
				<SharedTextCardTitle>{{ specificItemName(specificItem) }}</SharedTextCardTitle>
				<SharedTextBaseSecondary>{{ quantity }} available</SharedTextBaseSecondary>
			</div>
		</div>
		<USeparator />
		<div class="flex flex-row items-center justify-end gap-2 p-2">
			<UButton variant="ghost" color="error" :icon="icons['delete']" size="sm" aria-label="Remove from cart" @click="removeCartItem" />
			<SharedTextBaseSecondary class="text-right">In cart:</SharedTextBaseSecondary>
			<SharedIncrementDecrementPill :count="props.count" :min="1" :max="quantity" @increment="increment" @decrement="decrement" />
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	imgName: { type: String, required: true },
	specificItemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	quantity: { type: Number, required: true },
	count: { type: Number, default: 0 },
	specificItem: { type: Object, default: null },
})

const emit = defineEmits(["update:cart"])

const isSaving = ref(false)

const increment = async () => {
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { specificItemID: props.specificItemID, incrementChange: 1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const decrement = async () => {
	if (props.count <= 1) {
		return
	}
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { specificItemID: props.specificItemID, incrementChange: -1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const removeCartItem = async () => {
	await $fetch("/api/student/cart/cartItem", {
		method: "DELETE",
		body: { specificItemID: props.specificItemID },
	})
	emit("update:cart")
}

const specificItemName = (specificItem) => {
	if (!specificItem) {
		return ""
	}
	return specificItem.productName == "Default" ? specificItem.item.itemName : specificItem.productName
}
</script>
