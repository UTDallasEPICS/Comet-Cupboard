<template lang="pug">
div.bg-gray-700.py-4
    p.pb-4.text-white.text-center(class="text-5xl sm:text-6xl") Shop for Items
    // TODO: need to replace with combobox
    div.px-4
        input.text-black.text-4xl.w-full(type="text" placeholder="Search for items...")
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
