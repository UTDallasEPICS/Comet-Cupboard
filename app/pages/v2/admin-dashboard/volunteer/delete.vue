<template lang="pug">
div
    div(class="text-[40px] h-[651px] min-w-screen").font-semibold.font-montserrat.flex.items-center.justify-center.bg-white.text-center
        p Are you sure you want to delete<br>Name_Of_Volunteer ?
    div(class="min-w-screen h-[87px] mt-[31.79px] gap-[380px]").flex.flex-row
        button(class="w-[467px] h-[87px] bg-[#4a4a4a]" @click="cancel").flex.items-center.justify-center.text-5xl.font-semibold.font-montserrat.text-white.rounded-xl
            p Cancel
        button(class="w-[467px] h-[87px] bg-[#e87500]").flex.items-center.justify-center.text-5xl.font-semibold.font-montserrat.text-white.rounded-xl
            p Yes, Delete
</template>

<script lang="ts" setup>
function cancel(){
    navigateTo("/v2/admin-dashboard/volunteer")
}
</script>
