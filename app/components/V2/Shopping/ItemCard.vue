<template>
	<div class="drop-shadow-standard  relative rounded-xl bg-white px-3" style="min-width: 279px; height: 88px">
		<!-- dealbadge -->
		<V2ShoppingDealBadge
			v-if="dealExists"
			:badge="badgeType"
			:quantity="props.itemDeal.actualCount"
			:countsAs="props.itemDeal.adjustedCount"
			class="absolute top-2 right-2"
		/>

		<!-- image -->
		<img
			v-if="imgName"
			:src="`/api/image/${imgName}`"
			:alt="name"
			class="absolute rounded border border-gray-300 object-cover p-1"
			style="left: 13px; top: 14px; width: 60px; height: 60px"
		/>
		<div
			v-else
			class="absolute flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-400"
			style="left: 13px; top: 14px; width: 60px; height: 60px"
		>
			Product Image
		</div>

		<!-- name -->
		<div
			class="absolute flex h-full items-center text-left break-words text-black"
			style="left: 100px; top: 0; right: 90px; font-size: 15px; line-height: 17px"
		>
			{{ name }}
		</div>

		<!--add button -->
		<button
			class="hover:bg-green-900 absolute text-white"
			@click="addToCart"
			style="right: 4px; bottom: 4px; width: 70px; height: 28px; background-color: #154734; font-size: 18px; border-radius: 10px"
		>
			+ Add
		</button>
	</div>
</template>

<script lang="ts" setup>
import { useCartStore } from "~/stores/cart"

const store = useCartStore()
const { getCart } = store

const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
})

const emit = defineEmits(["added-to-cart"])

const dealExists = computed(() => {
	return props.itemDeal && "actualCount" in props.itemDeal && "adjustedCount" in props.itemDeal
})

const badgeType = computed(() => {
	if (!dealExists.value) return null
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) return "free"
	return "deal"
})

const addToCart = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	await getCart()
	emit("added-to-cart")
}
</script>
