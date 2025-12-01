<template lang="pug">
//- Delete Volunteer Page: Page for deleting the specified volunteer.
div
	//- Header for the Delete Volunteer page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Delete Volunteer")(class="md_max-w-[600px]").md_rounded-b-xl
	
	//- Warning message
	div(class="md_max-w-[600px]").bg-yellow-warningv2.flex.flex-row.mx-auto.h-16.flex-grow.sm_h-24.md_rounded-2xl.mt-16.md_mt-20.w-full
		//- Warning Triangle Icon
		div.flex.items-center.justify-center.h-full.aspect-square
			ExclamationTriangleIcon(class="size-2/4")

		//- Displays the message warning the admin about deleting the volunteer.
		div(class="w-9/12").flex.items-center.font-medium.font-montserrat.h-full.text-sm.sm_text-xl
			p Volunteer will lose all access to the Comet Cupboard!

	div(class="w-11/12 lg_w-6/12").mx-auto
		//- Prompt for deleting the specified volunteer
		div.w-full.rounded-lg.bg-white.font-montserrat.flex.items-center.justify-center.mx-auto.rounded-xl.text-center.text-md.sm_text-3xl.h-80.lg_h-96.mt-4.drop-shadow-standard.p-2
			p Are you sure you want to delete<br><span class="font-semibold">{{ state.deleteNetID }}</span> ?

		//- Buttons for canceling or confirming the deletion of the specified volunteer
		div.w-full.flex.flex-row.mt-3.lg_mt-8.mx-auto.h-11.sm_h-16.mb-2
			//- Cancel button: if this button is pressed, then the deletion of the specified volunteer will be canceled.
			button(@click="cancel").bg-cupboardv2-dg.flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-full.remove-button-effects
				p Cancel

			//- Delete button: if this button is pressed, then the specified volunteer will be deleted.
			button(@click="removeVolunteer").bg-utd-orange.flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-full.ml-auto.remove-button-effects
				p Yes, Delete
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid" //Icon used for warning message

//Router used for navigating back to the volunteer page:
import { useRouter } from "vue-router"
const router = useRouter()

const state = history.state //The netID of the specified volunteer is stored in this state (the state at the top of the history stack). This is used to make sure no accidental deletions take place.

//Execute this function if the cancel button is pressed:
function cancel() {
	router.replace("/v2/admin/volunteer") //Moves back to the volunteer page
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
	router.replace("/v2/admin/volunteer") //Moves back to the volunteer page
}
</script>
