<template>
	<div class="mx-auto flex max-w-[800px] flex-col gap-y-4 rounded-xl bg-white p-4">
		<!-- Input form for entering the name of the source to be added. -->
		<div class="mx-auto flex h-8 max-w-96 flex-row gap-x-3">
			<div
				class="focus-within:drop-shadow-standard flex h-full w-full items-center rounded-md border border-gray-300 bg-white transition-all duration-50 focus-within:border-blue-400"
			>
				<input placeholder="Source Name" type="text" v-model="newSource" @keydown.enter="addSource" class="w-full pl-2 outline-none" />
			</div>

			<!-- Add button: if either this button is pressed or the Enter key is pressed, then the source with the inputted name will be added. -->
			<SharedButtonPositiveAction text="+ Add" @click="addSource"/>

		</div>

		<!-- If at least 1 source exists, display the list of sources. Each source is represented as a card. -->
		<div v-if="sources?.length > 0" class="flex h-72 w-full flex-col gap-y-4 overflow-auto rounded-xl p-4">
			<AdminDashboardSourceCard v-for="source in sources" :key="source.name" :sourceName="source.name" />
		</div>

		<!-- Displays a message if no source exists. -->
		<div v-else class="flex h-72 w-full items-center justify-center rounded-xl p-4 text-center">
			<p>No sources have currently been added yet.</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const newSource = ref("")//Used as an input field for the name of the source to be added

const { data: sources, refresh: refreshSources } = await useFetch("/api/controls/sources");//List of sources that exists on the website

//Function for adding a source based on the inputted name.
const addSource = async () => {

    //Adds the source with the given name to the list of sources:
    if (newSource.value != "")
    {
        await $fetch("/api/inventory/source", {
            method: "PUT",
            body: JSON.stringify({ source: newSource.value }),
        })
        newSource.value = ""
        await refreshSources()
    }
}
</script>
