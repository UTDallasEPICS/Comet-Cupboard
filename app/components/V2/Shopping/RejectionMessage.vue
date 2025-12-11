<template lang="pug">
div.relative.w-full.rounded.flex.flex-col.p-4.shadow-md(style="max-width: 320px; height: 119px; background-color: #FFD580")
  
  //- header
  div.flex.justify-center.mb-2
    span.font-montserrat.font-medium.text-black(style="font-size: 20px; line-height: 24px") Reason for rejection
  
  //- message
  div.flex.flex-1.items-center.px-2
    //- warning icon
    ExclamationTriangleIcon.text-black.mr-3.flex-shrink-0(style="width: 24px; height: 24px")
    
    //- dunamic Message
    p.flex-1.font-montserrat.text-black.text-left(style="font-size: 16px; line-height: 20px") {{ message }}
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps({
  message: {
    type: String,
    default: "Sample message: blah bla bla blah.",
  },
})
</script>