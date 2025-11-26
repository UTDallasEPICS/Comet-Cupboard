<template lang="pug">
<!--Page for deleting the specified volunteer.-->
div
    <!--Prompt for deleting the specified volunteer-->
    div(class="w-5/6 rounded-lg").bg-white.font-semibold.font-montserrat.flex.items-center.justify-center.mx-auto.rounded-xl.text-center.text-base.lg_text-3xl.h-80.lg_h-96.mt-4.drop-shadow-standard
        p Are you sure you want to delete<br>{{state.deleteNetID}} ?
    
    <!--Buttons for canceling or confirming the deletion of the specified volunteer-->
    div(class="w-5/6").flex.flex-row.mt-3.lg_mt-8.mx-auto.h-11.lg_h-16

        <!--Cancel button: if this button is pressed, then the deletion of the specified volunteer will be canceled.-->
        button(class="bg-[#4a4a4a]" @click="cancel").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.w-28.lg_w-56.p-2.h-full
            p Cancel
        
        <!--Delete button: if this button is pressed, then the specified volunteer will be deleted.-->
        button(class="bg-[#e87500]" @click="removeVolunteer").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.ml-auto.w-28.lg_w-56.p-2.h-full
            p Yes, Delete
</template>

<script lang="ts" setup>
//Router used for navigating back to the volunteer page:
import { useRouter } from 'vue-router';
const router = useRouter()

const state = history.state;//The netID of the specified volunteer is stored in this state (the state at the top of the history stack). This is used to make sure no accidental deletions take place.

//Execute this function if the cancel button is pressed:
function cancel(){
    router.replace("/v2/admin-dashboard/volunteer")//Moves back to the volunteer page
}

//Function for deleting the specified volunteer:
const removeVolunteer = async () => {
	try {
        //Deletes the specified volunteer from the list of volunteers based on the given netID:
		await $fetch("/api/users/volunteer", {
			method: "DELETE",
			body: JSON.stringify({ netID: state.deleteNetID }),
		})
	} catch (error) {
        //Shouldn't happen when operating the website normally.
	}
    router.replace("/v2/admin-dashboard/volunteer")//Moves back to the volunteer page
}
</script>
