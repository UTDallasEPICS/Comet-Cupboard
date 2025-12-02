<template lang="pug">
//- Delete Volunteer Page: Page for deleting the specified volunteer.
div
	//- Header for the Delete Volunteer page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Delete Volunteer")(class="md_max-w-[600px]").md_rounded-b-xl
	
	//- Warning message
	div(class="md_max-w-[600px]").bg-yellow-warningv2.flex.flex-row.mx-auto.mt-16.md_mt-20.p-2
		//- Warning Triangle Icon
		div.flex.items-center.justify-center.h-8.aspect-square.my-auto
			ExclamationTriangleIcon

		//- Displays the message warning the admin about deleting the volunteer.
		div.flex.items-center.text-center.p-2.font-medium
			p Volunteer will lose all access to the Comet Cupboard!

	div(class="md_max-w-[600px]").mx-auto.mt-4
		//- Prompt for deleting the specified volunteer
		div.w-full.bg-white.flex.items-center.rounded-xl.text-center.h-80.drop-shadow-standard.font-semibold.justify-center
			p Are you sure you want to delete<br><span class="font-bold">{{ volunteerToBeDeleted }}</span> ?

		//- Buttons for canceling or confirming the deletion of the specified volunteer
		div.w-full.flex.flex-row.mt-3
			//- Cancel button: if this button is pressed, then the deletion of the specified volunteer will be canceled.
			button(@click="cancel").bg-cupboardv2-dg.block.text-white.rounded-xl.w-32.h-12.p-2.mx-auto.text-sm
				p Cancel

			//- Delete button: if this button is pressed, then the specified volunteer will be deleted.
			button(@click="removeVolunteer(volunteerToBeDeleted)").bg-utd-orange.block.text-white.rounded-xl.w-32.h-12.p-2.mx-auto.text-sm
				p Yes, Delete
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid" //Icon used for warning message

//Router used for navigating back to the volunteer page:
import { useRouter } from "vue-router"
const router = useRouter()

const route = useRoute()
const volunteerToBeDeleted = computed(() => route.params.volunteerNetID)//NetID of the volunteer to be deleted

//Execute this function if the cancel button is pressed:
function cancel() {
	router.replace("/v2/admin/volunteer") //Moves back to the volunteer page
}

//Function for deleting the specified volunteer:
const removeVolunteer = async (volunteerNetID: string | string[] | undefined) => {
	try {
		//Deletes the specified volunteer from the list of volunteers based on the given netID:
		await $fetch("/api/users/volunteer", {
			method: "DELETE",
			body: JSON.stringify({ netID: volunteerNetID }),
		})
	} catch (error) {
		//Shouldn't happen when operating the website normally.
	}
	router.replace("/v2/admin/volunteer") //Moves back to the volunteer page
}
</script>
