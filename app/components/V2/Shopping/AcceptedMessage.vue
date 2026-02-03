<template lang="pug">
  //-accepted message + countdown
  div.relative.flex.items-center.justify-center.px-4(class="w-full h-[97px] bg-[#8ABF65]")
    p.font-montserrat.font-medium.text-black.text-center(class="text-[20px] leading-[24px]")
      | Your cart has been accepted. Automatically signing out in {{ countdown }}...
</template>

<script setup lang="ts">
defineProps({
  countdown: {
    type: Number,
    required: true,
  },
})
</script>

