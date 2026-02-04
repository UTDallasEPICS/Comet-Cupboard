<template>
	<div class="mx-auto flex max-w-[800px] flex-col gap-y-4 rounded-xl bg-white p-4">
		<!-- Input form for entering the net ID of the volunteer to be added. -->
		<div class="mx-auto flex h-8 max-w-96 flex-row gap-x-3">
			<div
				class="focus-within:drop-shadow-standard flex h-full w-full items-center rounded-md border border-gray-300 bg-white transition-all duration-50 focus-within:border-blue-400"
			>
				<input
					placeholder="Volunteer NetID"
					type="text"
					v-model="newVolunteerNetID"
					@keydown.enter="assignVolunteer"
					class="w-full pl-2 outline-none"
				/>
			</div>

			<!-- Add button: if either this button is pressed or the Enter key is pressed, then the volunteer with the inputted net ID will be added. -->
			<V2SharedAddButton @click="assignVolunteer" class="h-full" />
		</div>

		<!-- If at least 1 volunteer is assigned, display the list of volunteers. Each volunteer is represented as a card. -->
		<div v-if="volunteers?.length > 0" class="bg-cupboardv2-2elg flex h-72 w-full flex-col gap-y-4 overflow-auto rounded-xl p-4">
			<V2AdminDashboardVolunteerCard v-for="volunteer in volunteers" :key="volunteer.netID" :volunteerID="volunteer.netID" />
		</div>

		<!-- Displays a message if no volunteer is assigned. -->
		<div v-else class="bg-cupboardv2-2elg flex h-72 w-full items-center justify-center rounded-xl p-4 text-center">
			<p>No volunteers have currently been assigned yet.</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const newVolunteerNetID = ref("")//Used as an input field for the net ID of the volunteer to be assign

const { data: volunteers, refresh} = await useFetch("/api/users/volunteers")//List of assigned volunteers on the website

//Function for assigning a volunteer based on the inputted net ID.
const assignVolunteer = async () => {

    //Adds the volunteer with the given net ID to the list of volunteers:
    if (newVolunteerNetID.value != "")
    {
        await $fetch("/api/users/volunteer", {
        method: "PUT",
        body: JSON.stringify({ netID: newVolunteerNetID.value }),
        })
        newVolunteerNetID.value = ""
        refresh()
    }
}
</script>
