<template lang="pug">
div.min-w-screen.rounded-2xl.bg-white
    div.h-6
    div(class="lg_w-[600px]").flex.flex-row.justify-center.mx-auto.h-7.lg_h-12.gap-3.w-60
        input(placeholder="Volunteer NetID" type="text" v-model="newVolunteerNetID" @keydown.enter="addVolunteer" class="w-7/12").outline.outline-black.flex.items-center.font-regular.font-montserrat.text-base.lg_text-3xl.pl-2.bg-white.h-full.rounded-xl
        button(@click="addVolunteer").bg-utd-green.font-semibold.font-montserrat.text-white.flex.items-center.justify-center.h-full.text-base.lg_text-3xl.rounded-xl.w-auto.p-2
            p + Add
    div(v-if="volunteers?.length > 0" class="w-10/12 bg-[#eeeeee]").overflow-auto.ml-auto.mr-auto.rounded-xl.h-80.lg_h-96.mt-4
        V2AdminDashboardVolunteerCard(v-for="volunteer in volunteers" :volunteerID="volunteer.netID")
    div(v-else class="w-10/12 bg-[#eeeeee]").font-semibold.font-montserrat.flex.items-center.justify-center.ml-auto.mr-auto.rounded-xl.text-center.text-base.md_text-3xl.h-80.lg_h-96.mt-4
        p No volunteers have currently been assigned yet.
    div.h-4
</template>

<script lang="ts" setup>
const newVolunteerNetID = ref("")
const { data: volunteers, refresh} = await useFetch("/api/users/volunteers")

const addVolunteer = async () => {
    await $fetch("/api/users/volunteer", {
        method: "PUT",
        body: JSON.stringify({ netID: newVolunteerNetID.value }),
    })

    newVolunteerNetID.value = ""
    refresh()
}
</script>
