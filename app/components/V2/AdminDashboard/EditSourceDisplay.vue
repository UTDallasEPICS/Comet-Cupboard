<template lang="pug">
div(class="min-w-screen rounded-2xl").bg-white.overflow-auto
    div(class="text-[#154734]").flex.items-center.justify-center.text-xl.lg_text-5xl.font-semibold.font-montserrat.w-full.h-10.lg_h-20
        p Community Garden
    div(class="lg_w-[600px]").flex.flex-row.justify-center.mx-auto.h-7.lg_h-12.gap-3.w-60
        input(placeholder="Field Name" type="text" class="w-7/12").outline.outline-black.flex.items-center.font-regular.font-montserrat.text-base.lg_text-3xl.pl-2.bg-white.h-full.rounded-xl
        button.bg-utd-green.font-semibold.font-montserrat.text-white.flex.items-center.justify-center.h-full.text-base.lg_text-3xl.rounded-xl.w-auto.p-2
            p + Add
    div(class="w-10/12 bg-[#eeeeee]").overflow-auto.ml-auto.mr-auto.rounded-xl.h-80.lg_h-96.mt-4
        V2AdminDashboardFieldCard(fieldName="Community Garden")
        V2AdminDashboardFieldCard(fieldName="Marketing")
        V2AdminDashboardFieldCard(fieldName="Community Garden")
        V2AdminDashboardFieldCard(fieldName="Marketing")
        V2AdminDashboardFieldCard(fieldName="Community Garden")
        V2AdminDashboardFieldCard(fieldName="Marketing")
        V2AdminDashboardFieldCard(fieldName="Community Garden")
        V2AdminDashboardFieldCard(fieldName="Marketing")
    div.h-4
</template>

<script lang="ts" setup>
</script>
