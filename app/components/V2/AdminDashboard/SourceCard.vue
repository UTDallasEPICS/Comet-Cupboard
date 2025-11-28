<template lang="pug">

//- Card representing the specified source.
div(class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
  
  //- Displays the name of the specified source on the left of the card.
  div(class="w-7/12").flex.items-center.font-bold.font-montserrat.h-full.ml-4.text-sm.lg_text-3xl
    p {{sourceName}}
  
  //- Edit button: if this button is pressed, move to the page for editing fields fo the specified source.
  div.flex.items-center.justify-center.ml-auto.h-full.aspect-square
    button(class="size-1/2" @click="editSource(sourceName)").p-1.remove-button-effects
      PencilIcon

</template>

<script lang="ts" setup>
import {PencilIcon} from '@heroicons/vue/24/solid';//Pencil icon used for the Edit button

//Router used for navigating to the page for editing fields fo the specified source.
import { useRouter } from 'vue-router';
const router = useRouter()

defineProps({
    sourceName: String//Name of the specified source
});

//Execute this function if the edit button is pressed.
function editSource(nameOfSource: string|undefined)
{
  router.push({path: "/v2/admin-dashboard/source/edit", state: {sourceName: nameOfSource}});//Navigates to the page for editing fields fo the specified source.
}

</script>
