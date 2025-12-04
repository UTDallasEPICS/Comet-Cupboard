<template lang="pug">
//- Display box for displaying the list of volunteers and a prompt to assign a volunteer
div(class="max-w-[800px]").flex.flex-col.mx-auto.rounded-xl.bg-white.p-4.gap-y-4

    //- Input form for entering the net ID of the volunteer to be added.
    div.max-w-96.flex.flex-row.mx-auto.h-8.gap-x-3
        div.bg-white.h-full.rounded-md.flex.items-center.w-full.border.border-gray-300.transition-all.duration-50(class="focus-within_border-blue-400 focus-within_drop-shadow-standard")
            input(placeholder="Volunteer NetID" type="text" v-model="newVolunteerNetID" @keydown.enter="assignVolunteer").w-full.outline-none.pl-2
        
        //- Add button: if either this button is pressed or the Enter key is pressed, then the volunteer with the inputted net ID will be added.
        V2SharedAddButton(@click="assignVolunteer").h-full
    
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
