<template lang="pug">
//- Edit Source Page: Page for editing fields of the specified source or deleting the specified source
div
	//- Header for the Edit Source page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Edit Source")(class="md_max-w-[600px]").md_rounded-b-xl
	

	//- Displays the list of fields for the specified source.
	V2AdminDashboardEditSourceDisplay(:sourceName="currentSource").mt-20

	//- Buttons for either deleting the specified volunteer or moving back to the sources page.
	div.min-w-72.flex.flex-row.mt-3.lg_mt-8.mx-auto.h-11.lg_h-20
		//- Delete button: if this button is pressed, then move to the page for deleting the specified source.
</template>

<script lang="ts" setup>
const route = useRoute()
const currentSource = computed(() => route.params.sourceName)
</script>
