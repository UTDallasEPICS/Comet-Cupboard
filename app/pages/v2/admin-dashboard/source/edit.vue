<template lang="pug">
div
    V2AdminDashboardEditSourceDisplay()
    div.min-w-screen.lg_flex.lg_flex-row.mt-3.lg_mt-8
        button(class="bg-[#d20b0b]" @click="navigateToDeletePage").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.w-full.lg_w-auto.p-2.h-9.lg_h-16
            p Delete Source
        div.h-2
        button(class="bg-[#154734]" @click="navigateBackToSourcePage").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.ml-auto.w-full.lg_w-auto.p-2.h-9.lg_h-16
            p Submit
</template>

<script lang="ts" setup>
function navigateBackToSourcePage(){
    navigateTo("/v2/admin-dashboard/source")
}
function navigateToDeletePage(){
    navigateTo("/v2/admin-dashboard/source/delete")
}
</script>
