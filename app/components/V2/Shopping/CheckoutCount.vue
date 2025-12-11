<template lang="pug">
div.flex.flex-col.bg-white.rounded-2xl.shadow-md.p-4(style="width: 320px")

  //-mark expired
  div.flex.items-center.justify-between.mb-4(style="gap: 12px")
    div.font-semibold.text-black.flex-1(style="font-size: 16px") Mark Expired Items
    div.flex.items-center
      div.rounded-sm.shadow-sm.flex.items-center.justify-center.cursor-pointer.transition(
        @click="toggleExpired"
        style="width: 20px; height: 20px; background-color: #154734"
      )
        CheckIcon.text-white(
          v-show="markExpiredItems"
          style="width: 20px; height: 20px"
        )

  //- total qty
  div.flex.flex-col.gap-3
    div.flex.items-center.justify-between
      span.font-medium.text-black(style="font-size: 15px") Total QTY
      input.text-center.font-medium.text-black.border.border-gray-300.rounded-md.outline-none(
        :value="cartTotalCount"
        type="number"
        readonly
        style="width: 60px; height: 30px"
        class="focus:ring-1 focus:ring-[#154734]"
      )

    //- adjusted qty
    div.flex.items-center.justify-between
      span.font-medium.text-black(style="font-size: 15px") Adjusted QTY
      input.text-center.font-medium.text-black.border.border-gray-300.rounded-md.outline-none(
        :value="cartAdjustedCount"
        type="number"
        readonly
        style="width: 60px; height: 30px"
        class="focus:ring-1 focus:ring-[#154734]"
      )
</template>

<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
  cartTotalCount: { type: Number, required: true },
  cartAdjustedCount: { type: Number, required: true },
  markExpiredItems: { type: Boolean, required: true },
})

const emit = defineEmits(["toggleExpired"])

const toggleExpired = () => {
  emit("toggleExpired")
}
</script>
