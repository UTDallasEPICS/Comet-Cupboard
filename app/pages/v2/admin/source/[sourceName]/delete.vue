<template lang="pug">
//- Delete Source Page: Page for deleting the specified source.
div
	//- Header for the Delete Source page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Delete Source")(class="md_max-w-[600px]").md_rounded-b-xl
	
	//- Warning message
	div(class="md_max-w-[600px]").bg-yellow-warningv2.flex.flex-row.mx-auto.mt-16.md_mt-20.p-2
		//- Warning Triangle Icon
		div.flex.items-center.justify-center.h-8.aspect-square.my-auto
			ExclamationTriangleIcon

		//- Displays the message warning the admin about deleting the volunteer.
		div.flex.items-center.text-center.p-2.font-medium
			p By removing this source, you won’t be able to access it anymore!

	div(class="md_max-w-[600px]").mx-auto.mt-4
		//- Prompt for deleting the specified source
		div.w-full.bg-white.flex.items-center.rounded-xl.text-center.h-80.drop-shadow-standard.font-semibold.justify-center
			p Are you sure you want to delete<br><span class="font-bold">{{ sourceToBeDeleted }}</span> ?

		//- Buttons for canceling or confirming the deletion of the specified source
		div.w-full.flex.flex-row.mt-3
			//- Cancel button: if this button is pressed, then the deletion of the specified source will be canceled.
			button(@click="cancel(sourceToBeDeleted)").bg-cupboardv2-dg.block.text-white.rounded-xl.w-32.h-12.p-2.mx-auto.text-sm
				p Cancel

			//- Delete button: if this button is pressed, then the specified source will be deleted.
			button(@click="removeSource(sourceToBeDeleted)").bg-utd-orange.block.text-white.rounded-xl.w-32.h-12.p-2.mx-auto.text-sm
				p Yes, Delete
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid" //Icon used for warning message

//Router used for navigating back to the page where you edit the specified source or the Sources page:
const router = useRouter()

const route = useRoute()
const sourceToBeDeleted = computed(() => route.params.sourceName)//Name of the source to be deleted

//Execute this function if the cancel button is pressed:
function cancel(sourceName: string | string[] | undefined) {
	router.replace(`/v2/admin/source/${sourceName}/edit`) //Moves you back to the page where you edit the specified source
}

//Function for deleting the specified source:
const removeSource = async (sourceName: string | string[] | undefined) => {
	try {
		//Deletes the specified source from the list of sources based on the given name:
		await $fetch("/api/inventory/sources", {
			method: "DELETE",
			body: JSON.stringify({ source: sourceName }),
		})
	} catch (error) {
		//Shouldn't happen when operating the website normally.
	}
	router.replace("/v2/admin/source") //Moves back to the Sources page
}
</script>
