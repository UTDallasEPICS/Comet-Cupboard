<template lang="pug">
div.relative.bg-white.rounded-lg.shadow.flex.items-center.px-2.pt-2.overflow-visible(style="width: 320px; height: 80px")
  //- deal
  V2ShoppingDealBadge(
    v-if="dealExists"
    :badge="badgeType"
    :quantity="props.itemDeal.actualCount"
    :countsAs="props.itemDeal.adjustedCount"
    class="absolute w-15 h-5"
    style="top: -3px; right: -4px"
  )

  //-x mark
  button.absolute.flex.items-center.justify-center.rounded.transition-colors.hover_bg-red-200.z-10(
    @click="removeCartItem"
    style="left: 8px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px"
  )
    XMarkIcon.fill-current.text-black.hover_text-red-500(style="width: 24px; height: 24px")
  
  //-image
  img(
    v-if="imgSrc"
    :alt="name || 'Product Image'"
    :src="imgSrc"
    class="absolute object-cover border border-gray-300 rounded p-1"
    style="left: 33px; top: 10px; width: 60px; height: 60px"
  )
  div.absolute.flex.items-center.justify-center.border.border-gray-300.rounded.bg-gray-100.text-gray-400(
    v-else
    style="left: 33px; top: 10px; width: 60px; height: 60px"
  ) Product Image
  div.absolute.top-0.h-full.flex.items-center(style="left: 100px; right: 70px")
    input.bg-transparent.border-none.outline-none.text-black.w-full(:value="name")

  //- if expired show
  div(
    :class="showExpired ? 'absolute right-2 top-0 h-full w-[50px] flex flex-col gap-1 items-end justify-start pt-4' : 'absolute right-2 top-0 h-full w-[50px] flex flex-col gap-1 items-end justify-center'"
  )
    input.w-full.text-center.rounded.outline-none(
      type="number"
      min="0"
      v-model.number="countValue"
      @keydown.enter="checkZero(countValue)"
      @blur="checkZero(countValue)"
      style="height: 32px; background-color: rgba(229, 231, 235, 0.6)"
    )
    div.flex.items-center.gap-2(v-if="showExpired")
      span.text-red-600.font-bold.text-xs Expired
      input.text-center.rounded.outline-none.text-sm(
        type="number"
        min="0"
        :max="countValue"
        v-model.number="expiredCountValue"
        @keydown.enter="checkZeroExpired(expiredCountValue)"
        @blur="checkZeroExpired(expiredCountValue)"
        style="width: 40px; height: 24px; background-color: rgba(229, 231, 235, 0.6)"
      )
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
