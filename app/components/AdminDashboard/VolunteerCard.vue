<template>
	<!-- Card representing the specified volunteer -->
	<div class="shadow-md flex w-full rounded-xl bg-white p-2">
		<!-- Volunteer icon -->
		<div class="aspect-square">
			<UserIcon />
		</div>
		<!-- Displays the net ID of the specified volunteer on the left of the card. -->
		<div class="ml-2 flex h-full items-center pr-1">
			<p>{{ volunteerID }}</p>
		</div>
		<!-- X button: if pressed, then move to the page for deleting the specified volunteer. -->
		<button @click="deleteVolunteer(volunteerID)" class="remove-button-effects ml-auto aspect-square w-8">
			<XMarkIcon />
		</button>
	</div>
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
  navigateTo({path: `/admin/volunteer/${netID}/delete`});//Navigates to the page for deleting the specified volunteer.
}
</script>
