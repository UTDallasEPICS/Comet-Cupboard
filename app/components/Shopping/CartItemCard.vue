<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />
		<div class="flex flex-row items-center gap-2">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-lg border object-cover" />

			<div class="flex w-full flex-col p-2">
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				<div class="flex flex-row items-center justify-between">
					<UBadge :label="`QTY: ${quantity}`" variant="outline" color="neutral" />
				</div>
			</div>
		</div>
		<div class="absolute right-2 bottom-2 flex flex-row items-center justify-between gap-2">
			<UButton
				variant="ghost"
				color="error"
				:icon="icons['delete']"
				size="sm"
				@click="removeCartItem"
			/>
			<SharedIncrementDecrementPill :count="props.count" :min="1" :max="quantity" @increment="increment" @decrement="decrement" />
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	quantity: { type: Number, required: true },
	count: { type: Number, default: 0 },
})

const emit = defineEmits(["update:cart"])

const isSaving = ref(false)

const increment = async () => {
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
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
		body: { itemID: props.itemID, incrementChange: -1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const removeCartItem = async () => {
	await $fetch("/api/student/cart/cartItem", {
		method: "DELETE",
		body: { itemID: props.itemID },
	})
	emit("update:cart")
}
</script>
