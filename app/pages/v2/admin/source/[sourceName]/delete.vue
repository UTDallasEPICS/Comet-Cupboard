
<template lang="pug">
//- Delete Source Page: Page for deleting the specified source.
div
	//- Header for the Delete Source page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Delete Source")(class="md_max-w-[600px]").md_rounded-b-3xl
    
	div.flex.flex-col.items-center.justify-center.gap-y-8.pt-10.mt-10
		//- Warning message: Displays the message warning the admin about deleting the source.
		V2SharedStatusMessageWarning(warningMessage="By removing this source, you won’t be able to access it anymore!")
        
		//- Prompt for deleting the specified source
		div.bg-white.w-full.max-w-96.h-80.rounded-xl.flex.flex-col.gap-3.drop-shadow-standard.items-center.justify-center.relative
			// Delete confirmation text
			div.flex.flex-col.items-center.justify-center.text-center.px-8.w-full
				p.text-3xl.text-black.font-normal.break-words Are you sure you want to delete
				p.text-4xl.text-black.font-bold.break-words {{ sourceToBeDeleted + "?" }}
	
		//- Buttons for canceling or confirming the deletion of the specified source
		div.flex.flex-row.gap-x-4.mt-20
			//- Cancel button: if this button is pressed, then the deletion of the specified source will be canceled.
			button(@click="cancel(sourceToBeDeleted)").bg-cupboardv2-dg.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Cancel
			//- Delete button: if this button is pressed, then the specified source will be deleted.
			button(@click="removeSource(sourceToBeDeleted)").bg-utd-orange.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Yes, Delete
</template>

<script lang="ts" setup>
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
