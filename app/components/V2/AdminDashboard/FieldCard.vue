<template lang="pug">
div(class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
  div(class="w-7/12").flex.items-center.font-bold.font-montserrat.h-full.ml-4.text-sm.lg_text-3xl
    p {{fieldName}}
  div.flex.items-center.justify-center.ml-auto.h-full.aspect-square
    button(class="size-1/2")
      XMarkIcon
</template>

<script lang="ts" setup>
import {XMarkIcon} from '@heroicons/vue/24/solid';
defineProps({
    fieldName: String,
});

</script>