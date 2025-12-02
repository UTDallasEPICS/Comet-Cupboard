<template lang="pug">
//- Display box for displaying the list of sources and a prompt to add a source
div.min-w-72.flex.flex-col.border-2.border-utd-green.rounded-xl.bg-white.p-4.gap-y-4

    //- Input form for entering the name of the source to be added.
    div(class="lg_w-[600px]").flex.flex-row.mx-auto.h-12.gap-x-3
        input(placeholder="Source Name" type="text" v-model="newSource" @keydown.enter="addSource").w-full.outline.outline-black.pl-2.bg-white.rounded-xl
        
        //- Add button: if either this button is pressed or the Enter key is pressed, then the source with the inputted name will be added.
        button(@click="addSource").bg-utd-green.text-white.rounded-xl.w-32.p-2.text-sm
            p + Add
    
    //- If at least 1 source exists, display the list of sources. Each source is represented as a card.
    div(v-if="sources?.length > 0").w-full.p-4.bg-cupboardv2-2elg.overflow-auto.rounded-xl.h-72.flex.flex-col.gap-y-4
        V2AdminDashboardSourceCard(v-for="source in sources" :sourceName="source.name")
    
    //- Displays a message if no source exists.
    div(v-else).w-full.p-4.bg-cupboardv2-2elg.rounded-xl.h-72.flex.items-center.justify-center.text-center
        p No sources have currently been added yet.
    
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
