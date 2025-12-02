<template lang="pug">
//- Edit Source Page: Page for editing fields of the specified source or deleting the specified source
div
	//- Header for the Edit Source page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Edit Source")(class="md_max-w-[600px]").md_rounded-b-xl
	

	//- Displays the list of fields for the specified source.
	V2AdminDashboardEditSourceDisplay(:sourceName="currentSource").mt-20
</template>

<script lang="ts" setup>
const route = useRoute()
const currentSource = computed(() => route.params.sourceName)
</script>
