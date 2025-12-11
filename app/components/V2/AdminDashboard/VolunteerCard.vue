<template lang="pug">

//- Card representing the specified volunteer
div.w-full.flex.rounded-xl.drop-shadow-standard.bg-white.p-2
  
  //- Volunteer icon
  div.aspect-square
    UserIcon
  
  //- Displays the net ID of the specified volunteer on the left of the card.
  div.font-bold.h-full.flex.items-center.ml-2.pr-1
    p {{volunteerID}}
  
  //- X button: if pressed, then move to the page for deleting the specified volunteer.
  button(@click="deleteVolunteer(volunteerID)").remove-button-effects.aspect-square.w-8.ml-auto
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
  navigateTo({path: `/v2/admin/volunteer/${netID}/delete`});//Navigates to the page for deleting the specified volunteer.
}
</script>
