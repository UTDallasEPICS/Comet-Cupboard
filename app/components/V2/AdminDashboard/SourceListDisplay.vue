<template lang="pug">
//- Display box for displaying the list of sources and a prompt to add a source
div.min-w-72.rounded-2xl.bg-white
    
    //- Applies some spacing between the input form and the top of the display box
    div.h-6

    //- Input form for entering the name of the source to be added.
    div(class="lg_w-[600px]").flex.flex-row.justify-center.mx-auto.h-7.lg_h-12.gap-3.w-60
        input(placeholder="Source Name" type="text" v-model="newSource" @keydown.enter="addSource" class="w-7/12").outline.outline-black.flex.items-center.font-regular.font-montserrat.text-base.lg_text-3xl.pl-2.bg-white.h-full.rounded-xl
        
        //- Add button: if either this button is pressed or the Enter key is pressed, then the source with the inputted name will be added.
        button(@click="addSource").bg-utd-green.font-semibold.font-montserrat.text-white.flex.items-center.justify-center.h-full.text-base.lg_text-3xl.rounded-xl.w-auto.p-2.remove-button-effects
            p + Add
    
    //- If at least 1 source exists, display the list of sources. Each source is represented as a card.
    div(v-if="sources?.length > 0" class="w-11/12 bg-[#eeeeee]").overflow-auto.ml-auto.mr-auto.rounded-xl.h-80.lg_h-96.mt-4
        V2AdminDashboardSourceCard(v-for="source in sources" :sourceName="source.name")
    
    //- Displays a message if no source exists.
    div(v-else class="w-11/12 bg-[#eeeeee]").font-semibold.font-montserrat.flex.items-center.justify-center.ml-auto.mr-auto.rounded-xl.text-center.text-base.md_text-3xl.h-80.lg_h-96.mt-4
        p No sources have currently been added yet.
    
    //- Applies some spacing between the list of sources and the end of the display box
    div.h-4
    
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
