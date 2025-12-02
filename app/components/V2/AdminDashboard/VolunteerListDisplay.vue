<template lang="pug">
//- Display box for displaying the list of volunteers and a prompt to assign a volunteer
div.min-w-72.flex.flex-col.border-2.border-utd-green.rounded-xl.bg-white.p-4.gap-y-4

    //- Input form for entering the net ID of the volunteer to be added.
    div(class="lg_w-[600px]").flex.flex-row.mx-auto.h-12.gap-x-3
        input(placeholder="Volunteer NetID" type="text" v-model="newVolunteerNetID" @keydown.enter="assignVolunteer").w-full.outline.outline-black.pl-2.bg-white.rounded-xl
        
        //- Add button: if either this button is pressed or the Enter key is pressed, then the volunteer with the inputted net ID will be added.
        button(@click="assignVolunteer").bg-utd-green.text-white.rounded-xl.w-32.p-2.text-sm
            p + Add
    
    //- If at least 1 volunteer is assigned, display the list of volunteers. Each volunteer is represented as a card.
    div(v-if="volunteers?.length > 0").w-full.p-4.bg-cupboardv2-2elg.overflow-auto.rounded-xl.h-72.flex.flex-col.gap-y-4
        V2AdminDashboardVolunteerCard(v-for="volunteer in volunteers" :volunteerID="volunteer.netID")
    
    //- Displays a message if no volunteer is assigned.
    div(v-else).w-full.p-4.bg-cupboardv2-2elg.rounded-xl.h-72.flex.items-center.justify-center.text-center
        p No volunteers have currently been assigned yet.

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
