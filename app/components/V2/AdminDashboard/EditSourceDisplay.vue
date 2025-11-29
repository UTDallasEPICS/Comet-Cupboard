<template lang="pug">
//- Display box for displaying the list of fields for the specified source and a prompt to add a field
div.min-w-72.bg-white.overflow-auto.rounded-2xl

    //- Displays the name of the specified source at the top.
    div.text-utd-green.flex.items-center.justify-center.text-xl.lg_text-5xl.font-semibold.font-montserrat.w-full.h-10.lg_h-20
        p {{sourceName}}
    
    //- Input form for entering the name of the field to be added for the specified source.
    div(class="lg_w-[600px]").flex.flex-row.justify-center.mx-auto.h-7.lg_h-12.gap-3.w-60
        input(placeholder="Field Name" type="text" v-model="fieldLabel" @keydown.enter="addFieldToSource(sourceName)" class="w-7/12").outline.outline-black.flex.items-center.font-regular.font-montserrat.text-base.lg_text-3xl.pl-2.bg-white.h-full.rounded-xl
        
        //- Add button: if either this button is pressed or the Enter key is pressed, then the field with the inputted name will be added to the specified source.
        button(@click="addFieldToSource(sourceName)").bg-utd-green.font-semibold.font-montserrat.text-white.flex.items-center.justify-center.h-full.text-base.lg_text-3xl.rounded-xl.w-auto.p-2.remove-button-effects
            p + Add
    
    div(v-for="source in sources")

        //- Finds the source with the specified name. That source will be the specified source.
        div(v-if="source.name == sourceName")

            //- If the specified source has at least 1 field:
            div(v-if="source.Fields?.length > 0" class="w-10/12").bg-cupboardv2-2elg.overflow-auto.ml-auto.mr-auto.rounded-xl.h-80.lg_h-96.mt-4
                
                //- Displays a list of fields for the specified source. Each field is represented as a card.
                div(v-for="field in source.Fields" class="w-11/12").flex.flex-row.rounded-xl.mx-auto.drop-shadow-standard.h-12.lg_h-20.bg-white.mt-2
                    
                    //- Displays the name of the specified field on the left of the card.
                    div(class="w-7/12").flex.items-center.font-bold.font-montserrat.h-full.ml-4.text-sm.lg_text-3xl
                        p {{field.name}}
                    
                    //- X button: if pressed, then the specified field will be deleted.
                    div.flex.items-center.justify-center.ml-auto.h-full.aspect-square
                        button(class="size-1/2" @click="removeField(field.fieldID)").remove-button-effects
                            XMarkIcon
            
            //- Displays a message if the specified source has no fields.
            div(v-else class="w-10/12").bg-cupboardv2-2elg.font-semibold.font-montserrat.flex.items-center.justify-center.ml-auto.mr-auto.rounded-xl.text-center.text-base.md_text-3xl.h-80.lg_h-96.mt-4
                p No fields have currently been added for this source yet.
    
    //- Applies some spacing between the list of fields and the end of the display box.
    div.h-4

</template>

<script lang="ts" setup>
const fieldLabel = ref("")//Used as an input field for the name of the field to be added

import {XMarkIcon} from '@heroicons/vue/24/solid';// Imports the X icon used as a button for deleting a field

const { data: sources, refresh: refreshSources } = await useFetch("/api/controls/sources");//List of sources that exists on the website

defineProps({
    sourceName: String //Name of the specified source
});

//Function for adding a field to the specified source based on the given name:
const addFieldToSource = async (nameOfSource: any) => {
	
    //Adds the field with the given name to the list of fields of the specified source:
    if (fieldLabel.value != "")
    {
        await $fetch("/api/inventory/field", {
            method: "POST",
            body: JSON.stringify({
                source: nameOfSource,
                fieldName: fieldLabel.value,
            }),
        })
        fieldLabel.value = ""
        await refreshSources()
    }
}

//Function for removing a field to the specified source based on the given ID
const removeField = async (fieldID: any) => {

	//Removes the field with the given ID from the list of fields of the specified source:
    await $fetch("/api/inventory/field", {
		method: "DELETE",
		body: JSON.stringify({ fieldID: fieldID }),
	})
	await refreshSources()
}
</script>
