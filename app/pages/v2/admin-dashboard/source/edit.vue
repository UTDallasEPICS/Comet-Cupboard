<template lang="pug">
//- Edit Source Page: Page for editing fields of the specified source or deleting the specified source
div
	//- Header for the Edit Source page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Edit Source")(class="md_max-w-[600px]").md_rounded-b-xl
	
	//- Displays the list of fields for the specified source.
	V2AdminDashboardEditSourceDisplay(:sourceName="state.sourceName").mt-20

	//- Buttons for either deleting the specified volunteer or moving back to the sources page.
	div.min-w-72.flex.flex-row.mt-3.lg_mt-8.mx-auto.h-11.lg_h-20
		//- Delete button: if this button is pressed, then move to the page for deleting the specified source.
		button(@click="deleteSource").bg-red-negativev2.flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-full.remove-button-effects
			p Delete Source

		//- Submit button: if this button is pressed, then move back to the source page
		button(@click="submit").bg-utd-green.flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-full.ml-auto.remove-button-effects
			p Submit
</template>

<script lang="ts" setup>
//Router used for navigating to either the source page of the page for deleting the selected source:
import { useRouter } from "vue-router"
const router = useRouter()

const state = history.state //The name of the specified volunteer is stored in this state (the state at the top of the history stack). This is used to make sure no accidental edits to the undefined source take place.

//Execute this function if the submit button is pressed:
function submit() {
	router.replace("/v2/admin-dashboard/source") //Navigate back to the source page.
}

//Execute this function if the delete button is pressed:
function deleteSource() {
	router.replace({ path: "/v2/admin-dashboard/source/delete", state: { deleteSourceName: state.sourceName } }) //Navigate to the page for deleting the specified source.
}
</script>
