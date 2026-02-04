<template>
	<div class="mx-auto flex max-w-[800px] flex-col gap-y-4 rounded-xl bg-white p-4">
		<!-- Navigate Back Button: clicking or tapping this button will take you to back to the Sources page: -->
		<V2SharedNavigateBackButton backTo="Sources" @click="goToSourcesPage" class="remove-button-effects" />
		<div class="flex items-center justify-center gap-1 text-center text-3xl font-bold">
			<!-- Displays the name of the specified source: -->
			<p class="text-utd-green">{{ sourceName }}</p>

			<!-- Delete Source button: clicking or tapping this button will take you to a page that asks if you want to remove the source: -->
			<button @click="deleteSource(sourceName)" class="remove-button-effects aspect-square h-8">
				<TrashIcon />
			</button>
		</div>

		<!-- Input form for entering the name of the field to be added for the specified source. -->
		<div class="mx-auto flex h-8 max-w-96 flex-row gap-x-3">
			<div
				class="focus-within:drop-shadow-standard flex h-full w-full items-center rounded-md border border-gray-300 bg-white transition-all duration-50 focus-within:border-blue-400"
			>
				<input
					placeholder="Field Name"
					type="text"
					v-model="fieldLabel"
					@keydown.enter="addFieldToSource(sourceName)"
					class="w-full pl-2 outline-none"
				/>
			</div>

			<!-- Add button: if either this button is pressed or the Enter key is pressed, then the field with the inputted name will be added to the specified source. -->
			<V2SharedAddButton @click="addFieldToSource(sourceName)" class="h-full" />
		</div>

		<template v-for="source in sources">
			<!-- Finds the source with the specified name. That source will be the specified source. -->
			<template v-if="source.name == sourceName">
				<!-- If the specified source has at least 1 field: -->
				<div v-if="source.Fields?.length > 0" class="bg-cupboardv2-2elg flex h-72 w-full flex-col gap-y-4 overflow-auto rounded-xl p-4">
					<!-- Displays a list of fields for the specified source. Each field is represented as a card. -->
					<div v-for="field in source.Fields" class="drop-shadow-standard flex w-full rounded-xl bg-white p-2">
						<!-- Displays the name of the specified field on the left of the card. -->
						<div class="flex h-full items-center font-bold">
							<p>{{ field.name }}</p>
						</div>

						<!-- X button: if pressed, then the specified field will be deleted. -->
						<button @click="removeField(field.fieldID)" class="remove-button-effects ml-auto aspect-square w-8">
							<XMarkIcon />
						</button>
					</div>
				</div>
			</template>
		</template>
	</div>
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
