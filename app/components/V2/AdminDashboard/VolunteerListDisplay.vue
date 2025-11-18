<template lang="pug">
div(class="min-w-screen min-h-screen").bg-white.overflow-auto.rounded-sm
    div(class="min-w-screen h-[77px] gap-[20px] mt-[11px]").flex.flex-row
        div(class="w-[652px] h-[77px] ml-[15px] bg-[#d9d9d9]").outline.outline-black.rounded-xl
            div(class="ml-[33px] w-[619px] h-[77px]").flex.items-center.text-5xl.font-regular.font-montserrat
                p Volunteer NetID
        div(class="w-[175px] h-[77px]").bg-utd-green.text-5xl.font-semibold.font-montserrat.text-white.rounded-xl.flex.items-center.justify-center
            p + Add
    hr(class="mt-[11px]").border-black
    V2AdminDashboardVolunteerCard(v-if="volunteers?.length > 0" v-for="volunteer in volunteers" :volunteerName="volunteer.netID" :gray="changeGray()")
    div(v-else class="text-[40px] h-[638px] min-w-screen").font-semibold.font-montserrat.flex.items-center.justify-center
        p No volunteers have currently been assigned yet.
</template>

<script lang="ts" setup>
let grayColor = false;
const { data: volunteers, refresh} = await useFetch("/api/users/volunteers")
function changeGray() {
    grayColor = !grayColor;
    return grayColor;
}
</script>
