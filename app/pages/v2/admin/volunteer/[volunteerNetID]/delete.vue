<template>
	<div>
		<div class="mt-10 flex flex-col items-center justify-center gap-y-8 pt-10">
			<!-- Warning message: Displays the message warning the admin about deleting the volunteer. -->
			<V2SharedStatusMessageWarning :warningMessage="`User with netID ${volunteerToBeDeleted} will lose volunteer permissions`" />

			<!-- Prompt for deleting the specified volunteer -->
			<div class="drop-shadow-standard relative flex h-80 w-full max-w-96 flex-col items-center justify-center gap-3 rounded-xl bg-white">
				<!-- Delete confirmation text -->
				<div class="flex w-full flex-col items-center justify-center px-8 text-center">
					<p class="break-words text-black">Are you sure you want to delete</p>
					<p class="break-words text-black">{{ volunteerToBeDeleted + "?" }}</p>
				</div>
			</div>

			<!-- Buttons for canceling or confirming the deletion of the specified volunteer -->
			<div class="mt-20 flex flex-row gap-x-4">
				<!-- Cancel button: if this button is pressed, then the deletion of the specified volunteer will be canceled. -->
				<button @click="cancel" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Cancel</p>
				</button>
				<!-- Delete button: if this button is pressed, then the specified volunteer will be deleted. -->
				<button
					@click="removeVolunteer(volunteerToBeDeleted)"
					class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl"
				>
					<p class="text-white">Yes, Delete</p>
				</button>
			</div>
		</div>
	</div>
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
