<template lang="pug">
div(class="min-w-screen h-[96px] bg-[#d9d9d9]" v-if="gray").flex.flex-row
  div(class="w-[499px] h-[93px] ml-[41px]").flex.items-center.text-3xl.font-regular.font-montserrat
    p {{volunteerName}}
  div(class="w-[77px] h-[77px] mr-[25px] mt-[9.11px]").flex.items-center.ml-auto
    XMarkIcon(class="w-[38.68px] h-[38.5px]")
div(class="min-w-screen h-[96px]" v-else).flex.flex-row
  div(class="w-[499px] h-[93px] ml-[41px]").flex.items-center.text-3xl.font-regular.font-montserrat
    p {{volunteerName}}
  div(class="w-[77px] h-[77px] mr-[25px] mt-[9.11px]").flex.items-center.ml-auto
    XMarkIcon(class="w-[38.68px] h-[38.5px]")
</template>

<script lang="ts" setup>
import {XMarkIcon} from '@heroicons/vue/24/outline';
defineProps({
    volunteerName: String,
    gray: Boolean
});

</script>
