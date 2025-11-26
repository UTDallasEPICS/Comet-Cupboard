<template lang="pug">
div
    div(class="w-5/6 rounded-lg").bg-white.font-semibold.font-montserrat.flex.items-center.justify-center.mx-auto.rounded-xl.text-center.text-base.lg_text-3xl.h-80.lg_h-96.mt-4.drop-shadow-standard
        p Are you sure you want to delete<br>{{state.deleteNetID}} ?
    div(class="w-5/6").flex.flex-row.mt-3.lg_mt-8.mx-auto
        button(class="bg-[#4a4a4a]" @click="cancel").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.w-28.lg_w-56.p-2.h-11.lg_h-16
            p Cancel
        button(class="bg-[#e87500]" @click="removeVolunteer(state.deleteNetID)").flex.items-center.justify-center.text-base.lg_text-4xl.font-semibold.font-montserrat.text-white.rounded-xl.ml-auto.w-28.lg_w-56.p-2.h-11.lg_h-16
            p Yes, Delete
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const state = history.state;
function cancel(){
    router.replace("/v2/admin-dashboard/volunteer")
}
const removeVolunteer = async (volunteerNetID) => {
	try {
		await $fetch("/api/users/volunteer", {
			method: "DELETE",
			body: JSON.stringify({ netID: volunteerNetID }),
		})
	} catch (error) {
	}
    router.replace("/v2/admin-dashboard/volunteer")
}
</script>
