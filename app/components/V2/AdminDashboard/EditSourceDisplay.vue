<template lang="pug">
//- Display box for displaying the list of fields for the specified source and a prompt to add a field
div(class="max-w-[800px]").flex.flex-col.mx-auto.rounded-xl.bg-white.p-4.gap-y-4

    //- Navigate Back Button: clicking or tapping this button will take you to back to the Sources page:
    V2SharedNavigateBackButton(backTo="Sources" @click="goToSourcesPage").remove-button-effects
    
    div.flex.items-center.justify-center.text-center.text-3xl.font-bold.gap-1
        //- Displays the name of the specified source:
        p.text-utd-green {{sourceName}}
        
        //- Delete Source button: clicking or tapping this button will take you to a page that asks if you want to remove the source:
        button(@click="deleteSource(sourceName)").remove-button-effects.aspect-square.h-8
            TrashIcon
        
    //- Input form for entering the name of the field to be added for the specified source.
    div.max-w-96.flex.flex-row.mx-auto.h-8.gap-x-3
        div.bg-white.h-full.rounded-md.flex.items-center.w-full.border.border-gray-300.transition-all.duration-50(class="focus-within_border-blue-400 focus-within_drop-shadow-standard")
            input(placeholder="Field Name" type="text" v-model="fieldLabel" @keydown.enter="addFieldToSource(sourceName)").w-full.outline-none.pl-2
        
        //- Add button: if either this button is pressed or the Enter key is pressed, then the field with the inputted name will be added to the specified source.
        V2SharedAddButton(@click="addFieldToSource(sourceName)").h-full
    
    template(v-for="source in sources")

        //- Finds the source with the specified name. That source will be the specified source.
        template(v-if="source.name == sourceName")

            //- If the specified source has at least 1 field:
            div(v-if="source.Fields?.length > 0").w-full.p-4.bg-cupboardv2-2elg.overflow-auto.rounded-xl.h-72.flex.flex-col.gap-y-4
                
                //- Displays a list of fields for the specified source. Each field is represented as a card.
                div(v-for="field in source.Fields").w-full.flex.rounded-xl.drop-shadow-standard.bg-white.p-2
                    
                    //- Displays the name of the specified field on the left of the card.
                    div.font-bold.h-full.flex.items-center
                        p {{field.name}}
                    
                    //- X button: if pressed, then the specified field will be deleted.
                    button(@click="removeField(field.fieldID)").remove-button-effects.aspect-square.w-8.ml-auto
                        XMarkIcon
            
            //- Displays a message if the specified source has no fields.
            div(v-else).w-full.p-4.bg-cupboardv2-2elg.rounded-xl.h-72.flex.items-center.justify-center.text-center
                p No fields have currently been added for this source yet.

</template>

<script lang="ts" setup>
const fieldLabel = ref("")//Used as an input field for the name of the field to be added

import {XMarkIcon, TrashIcon} from '@heroicons/vue/24/solid';// Imports the X icon used as a button for deleting a field

const { data: sources, refresh: refreshSources } = await useFetch("/api/controls/sources");//List of sources that exists on the website

const router = useRouter();//Router used for navigating to the page for deleting the specified source:

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

function goToSourcesPage() {
	navigateTo(`/v2/admin/source`)
}

function deleteSource(sourceName: string | undefined) {
    router.replace({path: `/v2/admin/source/${sourceName}/delete`})
}
</script>
