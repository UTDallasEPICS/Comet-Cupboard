<template>
	<div class="font-montserrat relative flex w-full items-center overflow-hidden rounded-lg bg-white px-2 shadow" style="height: 80px">
		<!-- deal badge -->
		<V2ShoppingDealBadge
			v-if="item.badge"
			:badge="item.badge"
			:quantity="item.quantity"
			:countsAs="item.countsAs"
			class="pointer-events-none absolute z-50 opacity-90"
			style="top: -6px; right: -6px"
		/>

		<!-- image -->
		<img
			v-if="item.imgName"
			:src="getImgSrc(item.imgName)"
			:alt="item.name || 'Product Image'"
			class="absolute h-[60px] w-[60px] rounded border border-gray-300 object-cover p-1"
			style="left: 13px; top: 10px"
		/>
		<PhotoIcon v-else class="absolute h-[60px] w-[60px] rounded border border-gray-300 p-2 text-gray-400" style="left: 13px; top: 14px" />

		<!-- name -->
		<div class="absolute flex h-full items-center" style="left: 100px; top: 0; right: 70px">
			<span class="w-full font-medium text-black" style="font-size: 15px">{{ item.name }}</span>
		</div>
		<div
			class="absolute flex h-full flex-col items-end"
			:class="item.qty2 > 0 ? 'justify-start pt-[16px]' : 'justify-center'"
			style="right: 8px; top: 0; width: 50px; gap: 4px"
		>
			<!-- total qty -->
			<div
				class="flex w-full items-center justify-center rounded text-center font-medium text-black"
				style="height: 30px; background-color: rgba(229, 231, 235, 0.3); font-size: 18px"
			>
				{{ item.qty }}
			</div>
			<!-- adjusted qty (qty2) -->
			<div class="flex items-center gap-2" v-if="item.qty2 > 0">
				<span class="font-bold text-red-600" style="font-size: 12px; line-height: 14px">Expired</span>
				<div
					class="flex items-center justify-center rounded text-center font-medium text-black"
					style="width: 42px; height: 24px; background-color: rgba(229, 231, 235, 0.3); font-size: 16px"
				>
					{{ item.qty2 }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PhotoIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

const config = useRuntimeConfig()
function getImgSrc(imgName) {
	if (!imgName) return null
	if (imgName.startsWith("http")) return imgName
	return `${config.public.API_BASE_URL || ""}/api/image/${imgName}`
}
</script>
