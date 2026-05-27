<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #body>
			<div class="mt-auto flex flex-row items-center gap-2">
				<SharedTextBase>QTY: {{ quantity }}</SharedTextBase>
				<SharedButtonPositiveAction text="Add" class="w-16" @click="addToCart" />
			</div>
		</template>
	</SharedItemCard>
</template>

<script lang="ts" setup>
const cartStore = useCartStore()

const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	quantity: { type: Number, default: 0 },
})

const addToCart = async () => {
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	await cartStore.getCart()
}
</script>
