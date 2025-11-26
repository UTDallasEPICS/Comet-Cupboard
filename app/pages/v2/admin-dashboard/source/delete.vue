<template lang="pug">
<!--Page for deleting the specified source.-->
div
    <!--Prompt for deleting the specified source-->
    div(class="w-5/6 rounded-lg").bg-white.font-semibold.font-montserrat.flex.items-center.justify-center.mx-auto.rounded-xl.text-center.text-base.lg_text-3xl.h-80.lg_h-96.mt-4.drop-shadow-standard
        p Are you sure you want to delete<br>{{state.deleteSourceName}} ?
    
    <!--Buttons for canceling or confirming the deletion of the specified source-->
    div(class="w-5/6").flex.flex-row.mt-3.lg_mt-8.mx-auto.h-11.lg_h-16
        
        <!--Cancel button: if this button is pressed, then the deletion of the specified source will be canceled.-->
        button(class="bg-[#4a4a4a]" @click="cancel").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.w-28.lg_w-56.p-2.h-full
            p Cancel
        
        <!--Delete button: if this button is pressed, then the specified source will be deleted.-->
        button(class="bg-[#e87500]" @click="removeSource").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.ml-auto.w-28.lg_w-56.p-2.h-full
            p Yes, Delete
</template>

<script lang="ts" setup>
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