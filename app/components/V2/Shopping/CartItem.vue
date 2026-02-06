<template>
	<div class=" relative flex w-full items-center overflow-hidden rounded-lg bg-white px-2 shadow" style="height: 80px">
		<!-- deal badge -->
		<V2ShoppingDealBadge
			v-if="dealExists"
			:badge="badgeType"
			:quantity="props.itemDeal.actualCount"
			:countsAs="props.itemDeal.adjustedCount"
			class="absolute h-5 w-15"
			style="top: -3px; right: -4px"
		/>

		<!--x mark -->
		<button
			@click="removeCartItem"
			class="hover:bg-red-200 absolute z-10 flex items-center justify-center rounded transition-colors"
			style="left: 8px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px"
		>
			<XMarkIcon class="hover:text-red-500 fill-current text-black" style="width: 24px; height: 24px" />
		</button>

		<!--image-->
		<img
			v-if="imgSrc"
			:alt="name || 'Product Image'"
			:src="imgSrc"
			class="absolute rounded border border-gray-300 object-cover p-1"
			style="left: 33px; top: 10px; width: 60px; height: 60px"
		/>
		<div
			v-else
			class="absolute flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-400"
			style="left: 33px; top: 10px; width: 60px; height: 60px"
		>
			Product Image
		</div>
		<div class="absolute top-0 flex h-full items-center" style="left: 100px; right: 70px">
			<input type="text" class="w-full border-none bg-transparent text-black outline-none" :value="name" readonly />
		</div>

		<!-- if expired show -->
		<div
			:class="
				showExpired
					? 'absolute top-0 right-2 flex h-full w-[50px] flex-col items-end justify-start gap-1 pt-4'
					: 'absolute top-0 right-2 flex h-full w-[50px] flex-col items-end justify-center gap-1'
			"
		>
			<input
				type="number"
				min="0"
				v-model.number="countValue"
				@keydown.enter="checkZero(countValue)"
				@blur="checkZero(countValue)"
				class="w-full rounded text-center outline-none"
				style="height: 32px; background-color: rgba(229, 231, 235, 0.6)"
			/>
			<div class="flex items-center gap-2" v-if="showExpired">
				<span class="text-red-600">Expired</span>
				<input
					type="number"
					min="0"
					:max="countValue"
					v-model.number="expiredCountValue"
					@keydown.enter="checkZeroExpired(expiredCountValue)"
					@blur="checkZeroExpired(expiredCountValue)"
					class="rounded text-center outline-none"
					style="width: 40px; height: 24px; background-color: rgba(229, 231, 235, 0.6)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	count: { type: Number, required: true },
	expiredCount: { type: Number, required: true },
	showExpired: { type: Boolean, default: false },
	itemDeal: { type: Object, default: () => ({}) },
})

const emit = defineEmits(["update:cart"])
const countValue = ref(props.count)
const expiredCountValue = ref(props.expiredCount)

const config = useRuntimeConfig()
const imgSrc = computed(() => {
	if (!props.imgName) return null
	return props.imgName.startsWith("http") ? props.imgName : `${config.public.API_BASE_URL || ""}/api/image/${props.imgName}`
})

const dealExists = computed(() => {
	return props.itemDeal && "actualCount" in props.itemDeal && "adjustedCount" in props.itemDeal
})

const badgeType = computed(() => {
	if (!dealExists.value) return null
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) return "free"
	return "deal"
})
const changeCartItemCount = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: {
			itemID: props.itemID,
			incrementChange: 0,
			count: countValue.value,
		},
	})
	emit("update:cart")
}

const changeCartItemExpiredCount = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: {
			itemID: props.itemID,
			incrementChange: 0,
			expiredCount: expiredCountValue.value,
		},
	})
	emit("update:cart")
}

const removeCartItem = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "DELETE",
		body: { itemID: props.itemID },
	})
	emit("update:cart")
}

const checkZero = async (value: number) => {
	if (typeof value !== "number" || value < 0) countValue.value = 0
	await changeCartItemCount()
}

const checkZeroExpired = async (value: number) => {
	if (typeof value !== "number" || value < 0) expiredCountValue.value = 0
	await changeCartItemExpiredCount()
}

onMounted(() => {
	if (imgSrc.value) {
		const img = new Image()
		img.src = imgSrc.value
	}
})
</script>
