<template lang="pug">

<!--Display box for displaying the list of volunteers and a prompt to assign a volunteer-->
div.min-w-screen.rounded-2xl.bg-white
    
    <!--Applies some spacing between the input form and the top of the display box-->
    div.h-6

    <!--Input form for entering the net ID of the volunteer to be added.-->
    div(class="lg_w-[600px]").flex.flex-row.justify-center.mx-auto.h-7.lg_h-12.gap-3.w-60
        input(placeholder="Volunteer NetID" type="text" v-model="newVolunteerNetID" @keydown.enter="assignVolunteer" class="w-7/12").outline.outline-black.flex.items-center.font-regular.font-montserrat.text-base.lg_text-3xl.pl-2.bg-white.h-full.rounded-xl
        
        <!--Add button: if either this button is pressed or the Enter key is pressed, then the volunteer with the inputted net ID will be added.-->
        button(@click="assignVolunteer").bg-utd-green.font-semibold.font-montserrat.text-white.flex.items-center.justify-center.h-full.text-base.lg_text-3xl.rounded-xl.w-auto.p-2
            p + Add
    
    <!--If at least 1 volunteer is assigned, display the list of volunteers. Each volunteer is represented as a card.-->
    div(v-if="volunteers?.length > 0" class="w-10/12 bg-[#eeeeee]").overflow-auto.ml-auto.mr-auto.rounded-xl.h-80.lg_h-96.mt-4
        V2AdminDashboardVolunteerCard(v-for="volunteer in volunteers" :volunteerID="volunteer.netID")
    
    <!--Displays a message if no volunteer is assigned.-->
    div(v-else class="w-10/12 bg-[#eeeeee]").font-semibold.font-montserrat.flex.items-center.justify-center.ml-auto.mr-auto.rounded-xl.text-center.text-base.md_text-3xl.h-80.lg_h-96.mt-4
        p No volunteers have currently been assigned yet.
    
    <!--Applies some spacing between the list of volunteers and the end of the display box-->
    div.h-4

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
