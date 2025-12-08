<template lang="pug">
div.relative.w-full.bg-white.overflow-hidden.rounded-lg.shadow.font-montserrat.flex.items-center.px-2(style="height: 80px")
  //- deal badge
  V2ShoppingDealBadge(
    v-if="item.badge"
    :badge="item.badge"
    :quantity="item.quantity"
    :countsAs="item.countsAs"
    class="absolute z-50 pointer-events-none opacity-90"
    style="top: -6px; right: -6px"
  )

  //- image
  img(
    v-if="item.imgName"
    :src="getImgSrc(item.imgName)"
    :alt="item.name || 'Product Image'"
    class="absolute w-[60px] h-[60px] object-cover border border-gray-300 rounded p-1"
    style="left: 13px; top: 10px"
  )
  PhotoIcon(
    v-else
    class="absolute w-[60px] h-[60px] text-gray-400 border border-gray-300 rounded p-2"
    style="left: 13px; top: 14px"
  )

  //- name
  div.absolute.h-full.flex.items-center(style="left: 100px; top: 0; right: 70px")
    span.text-black.font-medium.w-full(style="font-size: 15px") {{ item.name }}

  div.absolute.h-full.flex.flex-col.items-end(
    :class="item.qty2 > 0 ? 'justify-start pt-[16px]' : 'justify-center'"
    style="right: 8px; top: 0; width: 50px; gap: 4px"
  )
    //- total qty
    div.w-full.text-center.font-medium.text-black.rounded.flex.items-center.justify-center(
      style="height: 30px; background-color: rgba(229, 231, 235, 0.3); font-size: 18px"
    ) {{ item.qty }}

    //- adjusted qty (qty2)
    div.flex.items-center.gap-2(v-if="item.qty2 > 0")
      span.text-red-600.font-bold(style="font-size: 12px; line-height: 14px") Expired
      div.text-center.font-medium.text-black.rounded.flex.items-center.justify-center(
        style="width: 42px; height: 24px; background-color: rgba(229, 231, 235, 0.3); font-size: 16px"
      ) {{ item.qty2 }}
      
</template>

<script setup lang="ts">
import { PhotoIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const config = useRuntimeConfig()
function getImgSrc(imgName) {
  if (!imgName) return null
  if (imgName.startsWith("http")) return imgName
  return `${config.public.API_BASE_URL || ""}/api/image/${imgName}`
}
</script>
