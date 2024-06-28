<template lang="pug">
div.bg-gray-500.text-white.text-center.text-6xl
    p Shop for Items
    //- Combobox(v-model="selectedPerson")
    //-     ComboboxInput.text-black(@change="query = $event.target.value")
    //-     ComboboxOptions.text-black
    //-         ComboboxOption(v-for="person in filteredPeople" :key="person" :value="person") {{ person }}
</template>

<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue"

// I'll fix this later
const people = ["Durward Reynolds", "Kenton Towne", "Therese Wunsch", "Benedict Kessler", "Katelyn Rohan"]
const selectedPerson = ref("bob")
const query = ref("")

const filteredPeople = computed(() =>
	query.value === ""
		? people
		: people.filter((person) => {
				return person.toLowerCase().includes(query.value.toLowerCase())
			})
)
</script>
