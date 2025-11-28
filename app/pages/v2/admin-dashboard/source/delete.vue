<template lang="pug">
//- Page for deleting the specified source.

//- Warning message
div(class="bg-[#ffd580] lg_w-5/12 lg_rounded-2xl lg_mt-2").flex.flex-row.mx-auto.h-16.flex-grow.sm_h-24
    //- Warning Triangle Icon
    div.flex.items-center.justify-center.h-full.aspect-square
        ExclamationTriangleIcon(class="size-2/4")
    
    //- Displays the message warning the admin about deleting the volunteer.
    div(class="w-9/12").flex.items-center.font-medium.font-montserrat.h-full.text-sm.sm_text-xl
        p By removing this source, you won’t be able to access it anymore!

div(class="w-11/12 lg_w-6/12").mx-auto

    //- Prompt for deleting the specified source
    div(class="w-full rounded-lg").bg-white.font-montserrat.flex.items-center.justify-center.mx-auto.rounded-xl.text-center.text-md.sm_text-3xl.h-80.lg_h-96.mt-4.drop-shadow-standard.p-2
        p(class="font-medium") Are you sure you want to delete<br><span class="font-semibold">{{state.deleteSourceName}}</span> ?
    
    //- Buttons for canceling or confirming the deletion of the specified source
    div(class="w-full").flex.flex-row.mt-3.lg_mt-8.mx-auto.h-11.sm_h-16.mb-2
        
        //- Cancel button: if this button is pressed, then the deletion of the specified source will be canceled.
        button(class="bg-[#4a4a4a]" @click="cancel").flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-full.remove-button-effects
            p Cancel
        
        //- Delete button: if this button is pressed, then the specified source will be deleted.
        button(class="bg-[#e87500]" @click="removeSource").flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-full.ml-auto.remove-button-effects
            p Yes, Delete
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid';//Icon used for warning message

//Router used for navigating back to the source page:
import { useRouter } from 'vue-router';
const router = useRouter()

const state = history.state;//The name of the specified source is stored in this state (the state at the top of the history stack). This is used to make sure no accidental deletions take place.

//Execute this function if the cancel button is pressed:
function cancel(){
    router.replace("/v2/admin-dashboard/source")//Moves back to the source page
}

//Function for deleting the specified source:
const removeSource = async () => {
	try {
		//Deletes the specified source from the list of sources based on the given name:
        await $fetch("/api/inventory/sources", {
			method: "DELETE",
			body: JSON.stringify({ source: state.deleteSourceName }),
		})
	} catch (error) {
        //Shouldn't happen when operating the website normally.
	}
    router.replace("/v2/admin-dashboard/source")//Moves back to the source page
}
</script>