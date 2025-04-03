<template lang="pug">
div.flex.flex-row.items-center.text-xl
	img(:alt="name" :src="`api/image/${imgName}`").aspect-square.w-16.h-16.drop-shadow-standard.object-cover.rounded-md
	div.w-full.ml-2
		div.flex.flex-row
			p.text-wrap.break-words {{ name }}
			input(
				min="0"
				step="1"
				type="number"
				v-model="countValue"
				@blur="checkZero(countValue)"
				@keydown.enter="checkZero(countValue)"
			).input.no-spinner.border-b-2.text-center.text-xl.h-min.w-10.ml-auto
		div(v-if="showExpired").flex.flex-row
			p.text-red-negative Expired
			input(
				min="0"
				step="1"
				type="number"
				v-model="expiredCountValue"
				@blur="checkZeroExpired(expiredCountValue)"
				@keydown.enter="checkZeroExpired(expiredCountValue)"
				:max="countValue"
			).input.no-spinner.border-b-2.text-center.text-xl.h-min.w-10.ml-auto
	button(@click="removeCartItem").ml-5
		XMarkIcon.size-8.fill-utd-green.stroke-utd-green.hover_fill-red-negative.hover_stroke-red-negative
</template>

<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgName: {
		type: String,
		required: true,
	},
	itemID: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		required: true,
	},
	expiredCount: {
		type: Number,
		required: true,
	},
	showExpired: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const emit = defineEmits(["update:cart"])

const countValue = ref(props.count)
const expiredCountValue = ref(props.expiredCount)

const changeCartItemCount = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 0, count: countValue.value },
	})
	emit("update:cart")
}

const changeCartItemExpiredCount = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 0, expiredCount: expiredCountValue.value },
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

const checkZero = async (newCountValue: number) => {
	if (typeof newCountValue !== "number") {
		countValue.value = 0
	}
	if (countValue.value == 0) {
		countValue.value = 0
	}
	await changeCartItemCount()
}

const checkZeroExpired = async (newExpiredCountValue: number) => {
	if (typeof newExpiredCountValue !== "number") {
		expiredCountValue.value = 0
	}
	await changeCartItemExpiredCount()
}
</script>
