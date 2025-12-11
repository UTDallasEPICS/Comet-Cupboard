<template lang="pug">
//- Delete Volunteer Page: Page for deleting the specified volunteer.
div
	//- Header for the Delete Volunteer page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Delete Volunteer")(class="md_max-w-[600px]").md_rounded-b-3xl
    
	div.flex.flex-col.items-center.justify-center.gap-y-8.pt-10.mt-10
		//- Warning message: Displays the message warning the admin about deleting the volunteer.
		V2SharedStatusMessageWarning(:warningMessage="`User with netID ${volunteerToBeDeleted} will lose volunteer permissions`")
        
		//- Prompt for deleting the specified volunteer
		div.bg-white.w-full.max-w-96.h-80.rounded-xl.flex.flex-col.gap-3.drop-shadow-standard.items-center.justify-center.relative
			// Delete confirmation text
			div.flex.flex-col.items-center.justify-center.text-center.px-8.w-full
				p.text-2xl.text-black.font-normal.break-words Are you sure you want to delete
				p.text-3xl.text-black.font-bold.break-words {{ volunteerToBeDeleted + "?" }}
	
		//- Buttons for canceling or confirming the deletion of the specified volunteer
		div.flex.flex-row.gap-x-4.mt-20
			//- Cancel button: if this button is pressed, then the deletion of the specified volunteer will be canceled.
			button(@click="cancel").bg-cupboardv2-dg.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Cancel
			//- Delete button: if this button is pressed, then the specified volunteer will be deleted.
			button(@click="removeVolunteer(volunteerToBeDeleted)").bg-utd-orange.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Yes, Delete
</template>

<script lang="ts" setup>
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
