<template lang="pug">

//- Card representing the specified volunteer
div(class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
  
  //- Volunteer icon
  div.flex.items-center.justify-center.h-full.aspect-square
    UserIcon(class="size-1/2")
  
  //- Displays the net ID of the specified volunteer on the left of the card.
  div(class="w-7/12").flex.items-center.font-bold.font-montserrat.h-full.text-sm.lg_text-3xl
    p {{volunteerID}}
  
  //- X button: if pressed, then move to the page for deleting the specified volunteer.
  div.flex.items-center.justify-center.ml-auto.h-full.aspect-square
    button(class="size-1/2" @click="deleteVolunteer(volunteerID)").remove-button-effects
      XMarkIcon
</template>

<script lang="ts" setup>
import {XMarkIcon, UserIcon} from '@heroicons/vue/24/solid';//Volunteer icon and the X icon (used for the X button)

//Router used for navigating to the page for deleting the specified volunteer:
import { useRouter } from 'vue-router';
const router = useRouter()

defineProps({
    volunteerID: String//Net ID of the specified volunteer
});

//Execute this function if the X button is pressed:
function deleteVolunteer(netID: string|undefined)
{
  router.push({path: "/v2/admin-dashboard/volunteer/delete", state: {deleteNetID: netID}});//Navigates to the page for deleting the specified volunteer.
}
</script>
