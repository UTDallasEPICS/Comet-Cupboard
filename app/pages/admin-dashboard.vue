<template lang="pug">
div
	h2(@click="showVolunteers = !showVolunteers").flex.text-2xl.font-bold.cursor-pointer
		| Add/Remove Volunteers
		div.mx-3
			PlusIcon.fill-white.stroke-white.bg-utd-green.h-8
	div(v-if="showVolunteers")
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
				button(@click="addVolunteer").w-40.bg-utd-green.text-white.h-12 Add

		div
			div(v-for="volunteer in volunteers" :key="volunteer.netID" :value="volunteer.netID").flex.justify-between.items-center.p-3.border.border-gray-300
				p.text-lg.p-3.font-bold {{ volunteer.netID }}
				button(@click="removeVolunteer(volunteer.netID)").w-40.bg-red-negative.text-white.h-12 Remove

	div.py-3
		h2(@click="showSources = !showSources").flex.text-2xl.font-bold.cursor-pointer
			| Add/Edit Sources
			div.mx-3
				PlusIcon.fill-white.stroke-white.bg-utd-green.h-8
	div(v-if="showSources")
		div.flex.items-center.space-x-2.mb-5
			input(placeholder="Enter new source" type="text" v-model="newSource" @keydown.enter="addSource").w-full.h-12.text-lg.p-3.border.border-gray-300
			div.flex.justify-between.items-center.px-3
				button(@click="addSource").w-40.bg-utd-green.text-white.h-12 Add

		div
			h3.text-xl.font-bold Sources:
			div(v-for="source in sources").flex.justify-between.items-center.p-3.border.border-gray-300
				p.text-lg.p-3 {{ source.name }}
				button(@click="selectedSource = source").w-40.bg-utd-green.text-white.h-12 Edit Fields

		div(v-if="selectedSource").py-3
			p.text-lg.font-semibold Add field for {{ selectedSource.name }}
			div.flex.items-center.space-x-2.mb-10
				input(placeholder="Label (e.g. Name)" v-model="fieldLabel" @keydown.enter="addFieldToSource").w-full.h-12.text-lg.p-3.border.border-gray-300
				div.flex.justify-between.items-center.px-3
					button(@click="addFieldToSource").w-40.bg-utd-green.text-white.h-12 Add Field

			div(v-if="selectedSource.Fields?.length > 0")
				h4.text-md.font-semibold Fields for {{ selectedSource.name }}:
				div(v-for="field in selectedSource.Fields" :key="field.fieldID").flex.justify-between.items-center.p-3.border.border-gray-300
					p.text-lg.p-3.font-bold {{ field.name }}
					button(@click="removeField(field.fieldID)").w-40.bg-red-negative.text-white.h-12 Remove
</template>

<script setup>
import { PlusIcon } from "@heroicons/vue/24/solid"

const newVolunteerNetID = ref("")
const alertMessage = ref("")
const newSource = ref("")
const selectedSource = ref(null)
const fieldLabel = ref("")
const showVolunteers = ref(false)
const showSources = ref(false)

const { data: volunteers, refresh } = await useFetch("/api/users/volunteers")
const { data: sources, refresh: refreshSources } = await useFetch("/api/controls/sources")

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

const addSource = async () => {
	await $fetch("/api/inventory/source", {
		method: "PUT",
		body: JSON.stringify({ source: newSource.value }),
	})
	newSource.value = ""
	await refreshSources()
}

const addFieldToSource = async () => {
	await $fetch("/api/inventory/field", {
		method: "POST",
		body: JSON.stringify({
			source: selectedSource.value.name,
			fieldName: fieldLabel.value,
		}),
	})

	fieldLabel.value = ""
	await refreshSources()
	selectedSource.value = sources.value.find((source) => source.name === selectedSource.value.name)
}

const removeField = async (fieldID) => {
	await $fetch("/api/inventory/field", {
		method: "DELETE",
		body: JSON.stringify({ fieldID: fieldID }),
	})
	await refreshSources()
	selectedSource.value = sources.value.find((source) => source.name === selectedSource.value.name)
}
</script>
