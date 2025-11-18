<template lang="pug">
div(class="min-w-screen min-h-screen").bg-white.overflow-auto.rounded-t-lg
    div(class="min-w-screen h-[77px] text-[#154734]").flex.items-center.justify-center.text-5xl.font-semibold.font-montserrat
        p Source: Cannot Distribute
    hr(class="mt-[11px] border-[3px]").border-black
    div(class="min-w-screen h-[77px] gap-[20px] mt-[11px]").flex.flex-row
        div(class="w-[652px] h-[77px] ml-[15px] bg-[#d9d9d9]").outline.outline-black.rounded-xl
            div(class="ml-[33px] w-[619px] h-[77px]").flex.items-center.text-5xl.font-regular.font-montserrat
                p Source Name
        div(class="w-[175px] h-[77px]").bg-utd-green.text-5xl.font-semibold.font-montserrat.text-white.rounded-xl.flex.items-center.justify-center
            p + Add
    hr(class="mt-[11px] border-[3px]").border-black
    V2AdminDashboardFieldCard(fieldName="Community Garden" gray)
    V2AdminDashboardFieldCard(fieldName="Marketing")
div(class="min-w-screen h-[87px] mt-[31.79px] gap-[380px]").flex.flex-row
    div(class="w-[467px] h-[87px] bg-[#d20b0b]").flex.items-center.justify-center.text-5xl.font-semibold.font-montserrat.text-white.rounded-xl
        p Delete Source
    div(class="w-[467px] h-[87px] bg-[#154734]").flex.items-center.justify-center.text-5xl.font-semibold.font-montserrat.text-white.rounded-xl
        p Submit
</template>

<script lang="ts" setup>
let grayColor = false;
function changeGray() {
    grayColor = !grayColor;
    return grayColor;
}
</script>
