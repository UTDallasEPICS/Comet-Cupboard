<template lang="pug">
div(class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
  div(class="w-7/12").flex.items-center.font-bold.font-montserrat.h-full.ml-4.text-sm.lg_text-3xl
    p {{sourceName}}
  div.flex.items-center.justify-center.ml-auto.h-full.aspect-square
    button(class="size-1/2" @click="navigateToEditSource").p-1
      PencilIcon
</template>

<script lang="ts" setup>
import {PencilIcon} from '@heroicons/vue/24/solid';
defineProps({
    sourceName: String
});

function navigateToEditSource()
{
  navigateTo("/v2/admin-dashboard/source/edit");
}
</script>