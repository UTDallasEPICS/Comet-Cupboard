<template lang="pug">
div(class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
  div.flex.items-center.justify-center.h-full.aspect-square
    div(class="size-1/2")
      UserIcon
  div(class="w-7/12").flex.items-center.font-bold.font-montserrat.h-full.text-sm.lg_text-3xl
    p {{volunteerID}}
  div.flex.items-center.justify-center.ml-auto.h-full.aspect-square
    button(class="size-1/2" @click="deleteVolunteer(volunteerID)")
      XMarkIcon
</template>

<script lang="ts" setup>
import {XMarkIcon, UserIcon} from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router';
const router = useRouter()
defineProps({
    volunteerID: String
});
function deleteVolunteer(netID: string|undefined)
{
  router.push({path: "/v2/admin-dashboard/volunteer/delete", state: {deleteNetID: netID}});
}
</script>
