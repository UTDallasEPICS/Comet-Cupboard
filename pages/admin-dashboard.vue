<template lang="pug">
div
	h2.text-2xl.font-bold Add/Remove Volunteers

	div.h-6
		p(v-if="alertMessage").text-red-500.font-bold.mt-3 {{ alertMessage }}

	div.flex.items-center.space-x-2.mb-10
		input(
			placeholder="Enter Volunteer netID"
			type="text"
			v-model="newVolunteerNetID"
			@keydown.enter="addVolunteer"
		).w-full.h-12.text-lg.p-3.border.border-gray-300
		div.flex.justify-between.items-center.px-3
			button(@click="addVolunteer").button.w-40.bg-utd-green.text-white Add

	div
		div(v-for="volunteer in volunteers" :key="volunteer.netID" :value="volunteer.netID").flex.justify-between.items-center.p-3.border.border-gray-300
			p.text-lg.p-3.font-bold {{ volunteer.netID }}
			button(@click="removeVolunteer(volunteer.netID)").button.w-40.bg-red-negative.text-white Remove
</template>

<script setup>
const newVolunteerNetID = ref("")
const alertMessage = ref("")

const { data: volunteers, refresh } = await useFetch("/api/users/volunteers")

const addVolunteer = async () => {
	try {
		await $fetch("/api/users/volunteer", {
			method: "PUT",
			body: JSON.stringify({ netID: newVolunteerNetID.value }),
		})

		alertMessage.value = ""
		newVolunteerNetID.value = ""
		refresh()
	} catch (error) {
		alertMessage.value = error.statusMessage
		result = []
	}
}

const removeVolunteer = async (volunteerNetID) => {
	alertMessage.value = ""
	try {
		await $fetch("/api/users/volunteer", {
			method: "DELETE",
			body: JSON.stringify({ netID: volunteerNetID }),
		})

		refresh()
	} catch (error) {
		alertMessage.value = error.statusMessage
	}
}
</script>
