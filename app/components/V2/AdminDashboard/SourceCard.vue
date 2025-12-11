<template lang="pug">

//- Card representing the specified source.
div.w-full.flex.rounded-xl.drop-shadow-standard.bg-white.p-2
  
  //- Displays the name of the specified source on the left of the card.
  div.font-bold.h-full.flex.items-center.pr-1
    p {{sourceName}}
  
  //- Edit button: if this button is pressed, move to the page for editing fields fo the specified source.
  button(@click="editSource(sourceName)").remove-button-effects.aspect-square.w-8.ml-auto
    PencilIcon

</template>

<script lang="ts" setup>
import {PencilIcon} from '@heroicons/vue/24/solid';//Pencil icon used for the Edit button

defineProps({
    sourceName: String//Name of the specified source
});

//Execute this function if the edit button is pressed.
function editSource(nameOfSource: string|undefined)
{
  navigateTo({path: `/v2/admin/source/${nameOfSource}/edit`});//Navigates to the page for editing fields fo the specified source.
}

</script>
